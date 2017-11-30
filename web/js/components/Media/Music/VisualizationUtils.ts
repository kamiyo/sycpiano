/* tslint:disable:no-var-requires */
const math: any = require('mathjs');
const jBinary: any = require('jbinary');
const jDataView: any = require('jdataview');
/* tslint:enable:no-var-requires */

type DrawCircleMaskShape = (
    context: CanvasRenderingContext2D,
    radius: number,
    center: [number, number],
    dimensions: [number, number],
) => void;

export const drawCircleMask: DrawCircleMaskShape = (context, radius, center, dimensions) => {
    context.save();
    context.beginPath();
    context.arc(center[0], center[1], radius, 0, 2 * Math.PI);
    context.closePath();
    context.clip();
    context.clearRect(0, 0, dimensions[0], dimensions[1]);
    context.restore();
};

type PolarToCartesianShape = (
    radius: number,
    angle: number,
    offset: [number, number],
) => [number, number];

export const polarToCartesian: PolarToCartesianShape = (radius, angle, offset) => (
    [
        radius * Math.cos(angle) + offset[0],
        radius * Math.sin(angle) + offset[1],
    ]
);

type CartesianToPolarShape = (
    x: number,
    y: number,
) => { radius: number, angle: number };

export const cartesianToPolar: CartesianToPolarShape = (x, y) => (
    {
        radius: Math.sqrt(x * x + y * y),
        angle: Math.atan2(y, x),
    }
);

export const formatTime = (current: number) => {
    if (current === -1) {
        return '--:--';
    }
    const minutes = Math.floor(current / 60);
    const seconds = Math.floor(current - 60 * minutes);
    const minutesDisplay = `${minutes < 10 ? '0' : ''}${minutes}`;
    const secondsDisplay = `${seconds < 10 ? '0' : ''}${seconds}`;
    return `${minutesDisplay}:${secondsDisplay}`;
};

export class WaveformLoader {
    headerStructure = {
        version: 'int32',
        flags: 'uint32',
        sampleRate: 'int32',
        samplesPerPixel: 'int32',
        length: 'uint32',
    };
    header: {
        version: number;
        flags: number;
        sampleRate: number;
        samplesPerPixel: number;
        length: number;
    } = undefined;
    waveform: Float32Array = undefined;
    loaded: Promise<any>;

    reset = () => {
        this.header = undefined;
        this.waveform = undefined;
    }

    loadWaveformFile = (filename: string) => {
        this.header = undefined;
        this.waveform = undefined;
        this.loaded = new Promise((resolve) => {
            jBinary.loadData(filename).then((data: any) => {
                const j = new jBinary(new jDataView(data, 0, data.byteLength, true));
                const header = j.read(this.headerStructure);
                const type = header.flags ? 'int8' : 'int16';
                const body = j.read({
                    values: ['array', type],
                });
                const maxAbs = body.values.reduce((acc: number, value: number) => {
                    if (Math.abs(value) > acc) {
                        acc = value;
                    }
                    return acc;
                }, 0);
                this.waveform = Float32Array.from(body.values, (num) => num / maxAbs);
                this.header = header;
                return resolve();
            });
        });
    }
}

export const waveformLoader = new WaveformLoader();

class FIRLoader {
    headerStructure = {
        numCrossings: 'uint32',
        samplesPerCrossing: 'uint32',
        cutoffcycle: 'float32',
        kaiserBeta: 'float32',
    };
    numCrossings: number;
    samplesPerCrossing: number;
    filterSize: number;
    halfCrossings: number;
    loaded: Promise<any>;
    coeffs: number[];
    deltas: number[];

    constructor() {
        this.numCrossings = undefined;
        this.samplesPerCrossing = undefined;
        this.filterSize = undefined;
        this.coeffs = undefined;
        this.deltas = undefined;
        this.halfCrossings = undefined;
        this.loaded = this.loadFIRFile();
    }

    loadFIRFile = () => (
        new Promise((resolve) => {
            jBinary.loadData('/binary/fir.dat').then((data: any) => {
                const j = new jBinary(new jDataView(data, 0, data.byteLength, true));
                const header = j.read(this.headerStructure);
                this.numCrossings = header.numCrossings;
                this.samplesPerCrossing = header.samplesPerCrossing;
                this.halfCrossings = (this.numCrossings - 1) / 2;
                this.filterSize = this.samplesPerCrossing * (this.numCrossings - 1) - 1;
                const body = j.read({
                    coeffs: ['array', 'float32', this.filterSize],
                    deltas: ['array', 'float32', this.filterSize],
                });
                this.coeffs = body.coeffs;
                this.deltas = body.deltas;
                resolve();
            });
        })
    )
}

export const firLoader = new FIRLoader();

class ConstantQ {
    headerStructure = {
        sampleRate: 'uint32',
        binsPerOctave: 'uint32',
        minFreq: 'float32',
        maxFreq: 'float32',
        numRows: 'uint32',
        numCols: 'uint32',
        innerPtrSize: 'uint32',
        outerPtrSize: 'uint32',
    };
    matrix: any;
    loaded: Promise<any>;
    minF: number;
    maxF: number;
    numRows: number;
    numCols: number;
    sampleRate: number;

    constructor(sampleRate: number) {
        this.matrix = undefined;
        this.loaded = this.loadMatrix(`/binary/CQ_${sampleRate}.dat`);
        this.minF = 0;
        this.maxF = 0;
        this.numRows = 0;
        this.numCols = 0;
        this.sampleRate = sampleRate;
    }

    loadMatrix = (filename: string) => (
        new Promise((resolve) => {
            jBinary.loadData(filename).then((data: any) => {
                const j = new jBinary(new jDataView(data, 0, data.byteLength, true));
                const header = j.read(this.headerStructure);
                const body = j.read({
                    values: ['array', 'float32', header.innerPtrSize],
                    innerPtr: ['array', 'int32', header.innerPtrSize],
                    outerPtr: ['array', 'int32', header.outerPtrSize],
                });
                const o = {
                    mathjs: 'SparseMatrix',
                    values: body.values,
                    index: body.innerPtr,
                    ptr: body.outerPtr,
                    size: [header.numRows, header.numCols],
                    datatype: 'number',
                };
                this.numRows = header.numRows;
                this.numCols = header.numCols;
                this.minF = header.minFreq;
                this.maxF = header.maxFreq;
                this.matrix = math.type.SparseMatrix.fromJSON(o);
                resolve();
            });
        })
    )

    apply(input: Float32Array) {
        if (this.matrix) {
            const inputMatrix = new math.type.DenseMatrix.fromJSON({
                mathjs: 'DenseMatrix',
                data: [input],
                size: [1, input.length],
                datatype: 'number',
            });
            return math.multiply(inputMatrix, this.matrix).toArray()[0];
        }
        return input;
    }
}

export const constantQ = new ConstantQ((new AudioContext()).sampleRate);
