import {
    create,
    DenseMatrixDependencies,
    multiplyDependencies,
    SparseMatrixDependencies,
} from 'mathjs';
const { multiply, DenseMatrix, SparseMatrix } = create({
    multiplyDependencies,
    DenseMatrixDependencies,
    SparseMatrixDependencies,
}, {});

import jBinary from 'jbinary';
import jDataView from 'jdataview';

import { getAudioContext } from 'src/components/Media/Music/utils';

export const CIRCLE_SAMPLES = 512;

type DrawCircleMaskShape = (
    context: CanvasRenderingContext2D,
    radius: number,
    dimensions: [number, number],
    center?: [number, number],
) => void;

export const drawCircleMask: DrawCircleMaskShape = (context, radius, dimensions, center = [0, 0]) => {
    context.save();
    context.beginPath();
    context.arc(center[0], center[1], radius, 0, 2 * Math.PI);
    context.closePath();
    context.clip();
    context.clearRect(center[0] - dimensions[0] / 2, center[1] - dimensions[1] / 2, dimensions[0], dimensions[1]);
    context.restore();
};

const getCirclePoints = (points: number, offset: number = 0) => {
    const pointArray: {
        x: number;
        y: number;
    }[] = [];

    const twoPiPerPoints = 2 * Math.PI / points;
    for (let i = 0; i < points; i++) {
        const angle = i * twoPiPerPoints + offset;
        pointArray.push({
            x: Math.cos(angle),
            y: Math.sin(angle),
        });
    }
    return pointArray;
};

interface Binary extends jBinary {
    read(type: any, offset?: number): any;
}

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
    angles: { x: number; y: number; }[];

    loaded: Promise<any>;

    reset = () => {
        this.header = undefined;
        this.waveform = undefined;
        this.angles = undefined;
    }

    loadWaveformFile = (filename: string) => {
        this.header = undefined;
        this.waveform = undefined;
        this.loaded = new Promise((resolve) => {
            jBinary.loadData(filename).then((data: any) => {
                const j: Binary = new jBinary(new jDataView(data, 0, data.byteLength, true), {});
                const header = j.read(this.headerStructure);
                const type = header.flags ? 'int8' : 'int16';
                const body = j.read({
                    values: ['array', type],
                });
                const maxAbs = body.values.reduce((acc: number, value: number) => {
                    if (Math.abs(value) > acc) {
                        acc = Math.abs(value);
                    }
                    return acc;
                }, 0);
                this.waveform = Float32Array.from(body.values, (num) => num / maxAbs);
                this.header = header;
                const length = this.waveform.length / 2;
                this.angles = getCirclePoints(length, Math.PI / length);
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
    coeffs: Float32Array;
    deltas: Float32Array;

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
            jBinary.loadData(`${BINARY_PATH}/fir.dat`).then((data: any) => {
                const j: Binary = new jBinary(new jDataView(data, 0, data.byteLength, true), {});
                const header = j.read(this.headerStructure);
                this.numCrossings = header.numCrossings;
                this.samplesPerCrossing = header.samplesPerCrossing;
                this.halfCrossings = (this.numCrossings - 1) / 2;
                this.filterSize = this.samplesPerCrossing * (this.numCrossings - 1) - 1;
                const body = j.read({
                    coeffs: ['array', 'float32', this.filterSize],
                    deltas: ['array', 'float32', this.filterSize],
                });
                this.coeffs = Float32Array.from(body.coeffs);
                this.deltas = Float32Array.from(body.deltas);
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
    minF = 0;
    maxF = 0;
    numRows = 0;
    numCols = 0;
    sampleRate: number;
    angles: { x: number; y: number; }[];

    constructor(sampleRate: number) {
        this.matrix = undefined;
        this.loaded = this.loadMatrix(`${BINARY_PATH}/CQ_${sampleRate}.dat`);
        this.sampleRate = sampleRate;
    }

    loadMatrix = (filename: string) => (
        new Promise((resolve) => {
            jBinary.loadData(filename).then((data: any) => {
                const j: Binary = new jBinary(new jDataView(data, 0, data.byteLength, true), {});
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
                this.matrix = SparseMatrix.fromJSON(o);

                const cqBins = 2 * this.numCols;
                const invCqBins = 1 / cqBins;
                this.angles = getCirclePoints(CIRCLE_SAMPLES, Math.PI * (invCqBins + 1));
                resolve();
            });
        })
    )

    apply(input: Float32Array): Float32Array {
        if (this.matrix) {
            const inputMatrix = DenseMatrix.fromJSON({
                mathjs: 'DenseMatrix',
                data: [input],
                size: [1, input.length],
                datatype: 'number',
            });
            return Float32Array.from(multiply(inputMatrix, this.matrix).toArray()[0]);
        }
        return input;
    }
}

export const constantQ = new ConstantQ(getAudioContext().sampleRate);
