import jbinary from 'jbinary';
import jdv from 'jdataview';
import math from 'mathjs';

export const polarToCartesian = (radius, angle, offset) => (
    [
        radius * Math.cos(angle) + offset[0],
        radius * Math.sin(angle) + offset[1]
    ]
)

export class WaveformLoader {
    constructor(filename) {
        this.header = null;
        this.waveform = [];
        if (filename)
            this.loaded = this.loadWaveformFile(filename);
        else {
            this.loaded = Promise.resolve();
        }
    }

    loadWaveformFile = (filename) => {
        this.header = null;
        this.waveform = null;
        return new Promise((resolve, reject) => {
            jbinary.loadData(filename, (error, data) => {
                const j = new jbinary(new jdv(data, 0, data.byteLength, true));
                const header = j.read({
                    version: 'int32',
                    flags: 'uint32',
                    sampleRate: 'int32',
                    samplesPerPixel: 'int32',
                    length: 'uint32'
                });
                const type = header.flags ? 'int8' : 'int16'
                const body = j.read({
                    values: ['array', type]
                });
                const maxAbs = body.values.reduce((acc, value) => {
                    if (Math.abs(value) > acc) acc = value;
                    return acc;
                }, 0);
                this.waveform = Float32Array.from(body.values, (number, index) => number / maxAbs);
                this.header = header;
                return resolve();
            });
        })
    }
}

const firHeaderStructure = {
    numCrossings: 'uint32',
    samplesPerCrossing: 'uint32',
    cutoffcycle: 'float32',
    kaiserBeta: 'float32'
}

class FIRLoader {
    constructor() {
        this.numCrossings = null;
        this.samplesPerCrossing = null;
        this.filterSize = null;
        this.coeffs = null;
        this.deltas = null;
        this.loaded = this.loadFIRFile();
    }

    loadFIRFile = () => (
        new Promise((resolve, reject) => {
            jbinary.loadData('/binary/fir.dat', (error, data) => {
                // console.log(data);
                const j = new jbinary(new jdv(data, 0, data.byteLength, true));
                const header = j.read(firHeaderStructure);
                this.numCrossings = header.numCrossings;
                this.samplesPerCrossing = header.samplesPerCrossing;
                this.filterSize = this.samplesPerCrossing * (this.numCrossings - 1) - 1;
                const body = j.read({
                    coeffs: ['array', 'float32', this.filterSize],
                    deltas: ['array', 'float32', this.filterSize]
                });
                this.coeffs = body.coeffs;
                this.deltas = body.deltas;
                console.log(this.coeffs);
                resolve();
            });
        })
    );
}

export const firLoader = new FIRLoader();

const cqHeaderStructure = {
    sampleRate: 'uint32',
    binsPerOctave: 'uint32',
    minFreq: 'float32',
    maxFreq: 'float32',
    numRows: 'uint32',
    numCols: 'uint32',
    innerPtrSize: 'uint32',
    outerPtrSize: 'uint32'
}

class ConstantQ {
    constructor(sampleRate) {
        this.matrix = null;
        this.loaded = this.loadMatrix(`/binary/CQ_${sampleRate}.dat`);
        this.minF = 0;
        this.maxF = 0;
        this.numRows = 0;
        this.numCols = 0;
        this.sampleRate = sampleRate;
    }

    loadMatrix = (filename) => (
        new Promise((resolve, reject) => {
            jbinary.loadData(filename, (error, data) => {
                const j = new jbinary(new jdv(data, 0, data.byteLength, true));
                const header = j.read(cqHeaderStructure);
                // console.log(header);
                const body = j.read({
                    values: ['array', 'float32', header.innerPtrSize],
                    innerPtr: ['array', 'int32', header.innerPtrSize],
                    outerPtr: ['array', 'int32', header.outerPtrSize]
                })
                let o = {
                    mathjs: "SparseMatrix",
                    values: body.values,
                    index: body.innerPtr,
                    ptr: body.outerPtr,
                    size: [header.numRows, header.numCols],
                    datatype: "number"
                };
                this.numRows = header.numRows;
                this.numCols = header.numCols;
                this.minF = header.minFreq;
                this.maxF = header.maxFreq;
                this.matrix = math.type.SparseMatrix.fromJSON(o);
                console.log(this.matrix);
                resolve();
            })
        })
    )

    apply(input) {
        if (this.matrix) {
            const inputMatrix = new math.type.DenseMatrix.fromJSON({
                "mathjs": "DenseMatrix",
                data: [input],
                size: [1, input.length],
                datatype: 'number'
            });
            const result = math.multiply(inputMatrix, this.matrix).toArray();
            return result[0];
        }
        return input;
    }
}

export const constantQ = new ConstantQ((new AudioContext()).sampleRate);