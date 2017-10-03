import '@/less/Media/Music/visualizer.less';

import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { constantQ, firLoader, polarToCartesian } from '@/js/components/Media/Music/VisualizationUtils.js'
import { storeAnimationRequestId } from '@/js/components/Media/Music/actions.js'

const TWO_PI = 2 * Math.PI;
const HALF_PI = Math.PI / 2;
const PI = Math.PI;
const CIRCLE_SAMPLES = 2048;
const INV_CIRCLE_SAMPLES = 1 / CIRCLE_SAMPLES;
const TWO_PI_PER_CIRCLE_SAMPLES = TWO_PI * INV_CIRCLE_SAMPLES;
const GLOBAL_SCALE = 40;
const WAVEFORM_HALF_HEIGHT = 50;

class Visualizer extends React.Component {
    constructor(props) {
        super(props);
        props.registerPlayingCallback(this.onAnalyze);
    }

    initializeVisualizer = () => {
        this.el = ReactDOM.findDOMNode(this);
        this.visualization = this.el.getElementsByClassName('visualization')[0];
        this.height = this.visualization.offsetHeight;
        this.width = this.visualization.offsetWidth;
        this.visualization.height = this.height;
        this.visualization.width = this.width;
        this.center_x = this.width / 2;
        this.center_y = this.height / 2 - 100;
        this.visualizationCtx = this.visualization.getContext('2d');
        this.visualizationCtx.globalCompositionOperation = "lighter";
        this.lastPosition = 0;
        this.lastHighFreqs = new Array(30);
        this.lastHighFreqs.fill(0);

        Promise.all([constantQ.loaded, firLoader.loaded]).then((data) => {
            const cq = constantQ.matrix;
            this.frequencyData = new Uint8Array(constantQ.numRows);
            this.FFT_HALF_SIZE = constantQ.numRows;
            this.CQ_BINS = constantQ.numCols * 2;
            this.INV_CQ_BINS = 1 / this.CQ_BINS;

            this.HIGH_PASS_BIN = constantQ.maxF * this.FFT_HALF_SIZE / (constantQ.sampleRate / 2);
            this.LOW_PASS_BIN = constantQ.minF * this.FFT_HALF_SIZE / (constantQ.sampleRate / 2);

            this.NUM_CROSSINGS = firLoader.numCrossings;
            this.SAMPLES_PER_CROSSING = firLoader.samplesPerCrossing;
            this.firCoeffs = Float32Array.from(firLoader.coeffs);
            this.firDeltas = Float32Array.from(firLoader.deltas);
            this.HALF_CROSSINGS = (this.NUM_CROSSINGS - 1) / 2;
            this.FILTER_SIZE = firLoader.filterSize;
            this.FILTER_CENTER = this.SAMPLES_PER_CROSSING * this.HALF_CROSSINGS - 1;
            this.FFT_2_SCALE = 1 / (2 * this.FFT_HALF_SIZE);
            this.FFT_2_SCALE_HF = 1 / (2 * (this.FFT_HALF_SIZE - this.HIGH_PASS_BIN))
            this.OVERSAMPLING_RATIO = CIRCLE_SAMPLES / this.CQ_BINS;
            this.STEP_SIZE = 1 / this.OVERSAMPLING_RATIO;
            console.log(this);
        });
    }

    onAnalyze = (timestamp = 0) => {
        this.props.analyzers[0].getByteFrequencyData(this.frequencyData);
        const normalizedDataL = Float32Array.from(this.frequencyData, (number, index) => number / 255);

        this.props.analyzers[1].getByteFrequencyData(this.frequencyData);
        const normalizedDataR = Float32Array.from(this.frequencyData, (number, index) => number / 255);

        const accumulatorL = normalizedDataL.reduce((acc, value, index) => {
            if (value !== 0) {
                if (index >= this.HIGH_PASS_BIN) {
                    acc.highFreq += value;
                    acc.highFreqCount++;
                }
                if (index < this.LOW_PASS_BIN) {
                    acc.lowFreq += value;
                    acc.lowFreqCount++;
                }
            }
            return acc;
        }, {
                highFreq: 0,
                lowFreq: 0,
                highFreqCount: 0,
                lowFreqCount: 0
            });
        const resultL = constantQ.apply(normalizedDataL);

        const accumulatorR = normalizedDataR.reduce((acc, value, index) => {
            if (value !== 0) {
                if (index >= this.HIGH_PASS_BIN) {
                    acc.highFreq += value;
                    acc.highFreqCount++;
                }
                if (index < this.LOW_PASS_BIN) {
                    acc.lowFreq += value;
                    acc.lowFreqCount++;
                }
            }
            return acc;
        }, {
                highFreq: 0,
                lowFreq: 0,
                highFreqCount: 0,
                lowFreqCount: 0
            });
        const resultR = constantQ.apply(normalizedDataR).reverse();
        const result = Float32Array.from([...resultL, ...resultR]);
        let highFreq = (accumulatorL.highFreqCount !== 0 && accumulatorR.highFreqCount !== 0)
            ? (accumulatorL.highFreq + accumulatorR.highFreq) / (accumulatorL.highFreqCount + accumulatorR.highFreqCount)
            : 0;
        let lowFreq = (accumulatorL.lowFreq + accumulatorR.lowFreq) / (2 * this.LOW_PASS_BIN);
        this.lastHighFreqs.push(highFreq);
        this.lastHighFreqs.shift();
        highFreq = this.lastHighFreqs.reduce((acc, value) => {
            return acc + value;
        }, 0) / this.lastHighFreqs.length;

        this.drawVisualization(this.visualizationCtx, lowFreq, result, highFreq, timestamp);
        this.requestId = requestAnimationFrame(this.onAnalyze);
        this.props.storeAnimationRequestId(this.requestId);
    }

    drawConstantQBins = (context, values, radius, color) => {
        context.beginPath();
        let currentInput = 0;
        let currentSample = 0;
        let currentFraction = 0;

        while (currentSample < CIRCLE_SAMPLES && currentInput < this.CQ_BINS) {
            let index = Math.floor(currentFraction * this.SAMPLES_PER_CROSSING);
            let sum = 0;
            for (let i = index, x = this.HALF_CROSSINGS; i < this.FILTER_SIZE; i += this.SAMPLES_PER_CROSSING, x--) {
                let input = currentInput + x;
                if (input < 0) {
                    input += this.CQ_BINS;
                } else if (input >= this.CQ_BINS) {
                    input -= this.CQ_BINS;
                }
                const scale = values[input];
                sum += scale * this.firCoeffs[i];
            }
            const result = sum * GLOBAL_SCALE;
            // first term is the actual incrementing.
            // second term is adjusting so that the visualization is symmetric
            // third term is adjusting so it starts at the bottom of the screen.
            const angle = (currentSample * TWO_PI_PER_CIRCLE_SAMPLES) + (TWO_PI * this.INV_CQ_BINS) + HALF_PI;
            const [x, y] = polarToCartesian((radius + result), angle, [this.center_x, this.center_y]);

            if (currentSample === 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
            // update for next sample
            currentSample += 1;
            currentFraction += this.STEP_SIZE;
            if (currentFraction >= 1) {
                currentInput += 1;
                currentFraction -= 1;
            }
        }
        context.fillStyle = color;
        context.fill();
    }

    drawCircleMask = (context, radius) => {
        context.save();
        context.beginPath();
        context.arc(this.center_x, this.center_y, radius, 0, TWO_PI);
        context.closePath();
        context.clip();
        context.clearRect(0, 0, this.width, this.height);
        context.restore();
    }

    drawWaveForm = (context, centerAxis, color) => {
        // console.log(this.props.waveformLoader);
        const waveform = this.props.waveformLoader.waveform;
        const waveformLength = waveform.length / 2;
        const twoPiPerWaveformLength = TWO_PI / waveformLength;
        context.beginPath();
        // going through mins from start to end
        for (let j = 0; j < waveformLength; j++) {
            const angle = -HALF_PI + ((j + 0.5) * twoPiPerWaveformLength);  // progress through waveform converted to angle
            const scale = centerAxis + waveform[j * 2] * WAVEFORM_HALF_HEIGHT;
            const [x, y] = polarToCartesian(scale, angle, [this.center_x, this.center_y]);

            if (j === 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
        }

        // looping around maxes from end to start
        for (let j = waveformLength - 1; j >= 0; j--) {
            const angle = -HALF_PI + ((j + 0.5) * twoPiPerWaveformLength);  // progress through waveform converted to angle
            const scale = centerAxis + waveform[j * 2 + 1] * WAVEFORM_HALF_HEIGHT;
            const [x, y] = polarToCartesian(scale, angle, [this.center_x, this.center_y]);

            context.lineTo(x, y);
        }
        context.fillStyle = color;
        context.fill();
    }

    drawPlaybackHead = (context, playbackHead, minRad, maxRad) => {
        const angle = (this.props.duration) ? -HALF_PI + TWO_PI * playbackHead / this.props.duration : 0;
        const [xStart, yStart] = polarToCartesian(minRad, angle, [this.center_x, this.center_y]);
        const [xEnd, yEnd] = polarToCartesian(maxRad, angle, [this.center_x, this.center_y]);
        context.beginPath();
        context.moveTo(xStart, yStart);
        context.lineTo(xEnd, yEnd);
        context.strokeStyle = '#FFF';
        context.stroke();
    }

    drawSeekArea = (context, radius, color, timestamp) => {
        const WAVEFORM_CENTER_AXIS = radius - WAVEFORM_HALF_HEIGHT;
        this.drawWaveForm(context, WAVEFORM_CENTER_AXIS, color);

        let playbackHead = this.props.currentPosition;
        if (
            this.props.currentPosition &&
            this.props.currentPosition === this.lastPosition &&
            this.props.isPlaying
        ) {
            playbackHead = this.props.currentPosition + (timestamp - this.props.prevTimestamp) / 1000;
        } else {
            this.lastPosition = this.props.currentPosition;
        }

        this.drawPlaybackHead(
            context,
            playbackHead,
            WAVEFORM_CENTER_AXIS - WAVEFORM_HALF_HEIGHT,
            WAVEFORM_CENTER_AXIS + WAVEFORM_HALF_HEIGHT
        );
    }

    drawVisualization = (context, average, values, lightness, timestamp) => {
        context.clearRect(0, 0, this.width, this.height);

        // hsl derived from @light-blue: #4E86A4;
        const color = `hsl(201, ${36 + lightness * 64}%, ${47 + lightness * 53}%)`;
        const radius = 250 + average * 50;     // adjust large radius to change with the average of all values

        this.drawConstantQBins(context, values, radius, color);
        this.drawCircleMask(context, radius);
        this.drawSeekArea(context, radius, color, timestamp);
    }

    componentDidMount() {
        this.initializeVisualizer();
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.requestId);
    }

    shouldComponentUpdate(nextProps) {
        return this.props.waveformLoader !== nextProps.waveformLoader;
    }

    render() {
        return (
            <div className="visualizerContainer">
                <canvas className="visualization"></canvas>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    waveformLoader: state.audio_player.waveformLoader,
    currentPosition: state.audio_player.currentPosition,
    analyzers: state.audio_player.analyzers,
    isPlaying: state.audio_player.isPlaying,
    duration: state.audio_player.duration,
    prevTimestamp: state.audio_player.updateTimestamp
})

export default connect(
    mapStateToProps,
    {
        storeAnimationRequestId
    }
)(Visualizer);