import jbinary from 'jbinary';
import jdv from 'jdataview';
import math from 'mathjs';

// Constants so we don't have to calculate in time-sensitive loops
// includes reciprocals so we just have to multiply instead of divide
// uses lazy getters/memoization
const FFT_SIZE = 16384;
const FFT_HALF_SIZE = FFT_SIZE / 2;
const HIGH_PASS_BIN = 1600;
const SMOOTHING_CONSTANT = 0.5;
const TWO_PI = 2 * Math.PI;
const HALF_PI = Math.PI / 2;
const PI = Math.PI;
const CIRCLE_SAMPLES = 2048;
const TWO_PI_PER_CIRCLE_SAMPLES = TWO_PI / CIRCLE_SAMPLES;
const CQ_BINS = 84;
const OVERSAMPLING_RATIO = CIRCLE_SAMPLES / CQ_BINS;
const STEP_SIZE = 1 / OVERSAMPLING_RATIO;
const GLOBAL_SCALE = 40;
const WAVEFORM_HALF_HEIGHT = 50;
const FFT_2_SCALE = 1 / (2 * FFT_HALF_SIZE);
const FFT_2_SCALE_HF = 1 / (2 * (FFT_HALF_SIZE - HIGH_PASS_BIN));

export const CONSTANTS = {
    FFT_SIZE: FFT_SIZE,
    FFT_HALF_SIZE: FFT_HALF_SIZE,
    HIGH_PASS_BIN: HIGH_PASS_BIN,
    SMOOTHING_CONSTANT: SMOOTHING_CONSTANT,
    TWO_PI: TWO_PI,
    HALF_PI: HALF_PI,
    PI: PI,
    CIRCLE_SAMPLES: CIRCLE_SAMPLES,
    TWO_PI_PER_CIRCLE_SAMPLES: TWO_PI_PER_CIRCLE_SAMPLES,
    CQ_BINS: CQ_BINS,
    OVERSAMPLING_RATIO: OVERSAMPLING_RATIO,
    STEP_SIZE: STEP_SIZE,
    GLOBAL_SCALE: GLOBAL_SCALE,
    WAVEFORM_HALF_HEIGHT: WAVEFORM_HALF_HEIGHT,
    FFT_2_SCALE: FFT_2_SCALE,
    FFT_2_SCALE_HF: FFT_2_SCALE_HF,
}


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
        if (this.filename)
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
                this.header = header;
                this.waveform = body.values;
                return resolve();
            });
        })
    }
}

class FIRLoader {
    constructor() {
        this.numCrossings = null;
        this.samplesPerCrossing = null;
        this.FIR = null;
        this.loaded = this.loadFIRFile();
    }

    loadFIRFile = () => (
        new Promise((resolve, reject) => {
            jbinary.loadData('/binary/fir.dat', (error, data) => {
                const j = new jbinary(new jdv(data, 0, data.byteLength, true));
                const body = j.read({
                    numCrossings: 'uint32',
                    samplesPerCrossing: 'uint32',
                    values: ['array', 'float64']
                });
                this.numCrossings = body.numCrossings;
                this.samplesPerCrossing = body.samplesPerCrossing;
                this.FIR = body.values;
                resolve();
            });
        })
    );
}

export const firLoader = new FIRLoader();

class ConstantQ {
    constructor() {
        this.matrix = null;
        this.loaded = this.loadMatrix();
    }

    loadFile = (filename, type) => (
        new Promise((resolve, reject) => {
            jbinary.loadData(filename, (error, data) => {
                const j = new jbinary(new jdv(data, 0, data.byteLength, true));
                const parsedData = j.read({ values: ['array', type] });
                resolve(parsedData.values);
            });
        })
    );

    loadMatrix = () => (
        Promise.all([
            this.loadFile('/binary/values.dat', 'float32'),
            this.loadFile('/binary/indices.dat', 'int32'),
            this.loadFile('/binary/pointers.dat', 'int32')
        ]).then(data => {
            let o = {
                mathjs: "SparseMatrix",
                values: data[0],
                index: data[1],
                ptr: data[2],
                size: [8192, 42],
                datatype: "number"
            };
            this.matrix = math.type.SparseMatrix.fromJSON(o);
        })
    );

    apply(input) {
        if (this.matrix) {
            const inputMatrix = new math.type.DenseMatrix.fromJSON({
                "mathjs": "DenseMatrix",
                data: [input],
                size: [1, 8192],
                datatype: 'number'
            });
            const result = math.multiply(inputMatrix, this.matrix).toArray();
            return result[0];
        }
        return input;
    }
}

export const constantQ = new ConstantQ();