import '@/less/Media/Music/audio-visualizer.less';

import React from 'react';
import { connect } from 'react-redux';
import { waveformLoader, constantQ, firLoader, polarToCartesian, drawCircleMask } from '@/js/components/Media/Music/VisualizationUtils.js'
import { storeAnimationRequestId, storeRadii } from '@/js/components/Media/Music/actions.js'

const TWO_PI = 2 * Math.PI;
const HALF_PI = Math.PI / 2;
const PI = Math.PI;
const CIRCLE_SAMPLES = 2048;
const INV_CIRCLE_SAMPLES = 1 / CIRCLE_SAMPLES;
const TWO_PI_PER_CIRCLE_SAMPLES = TWO_PI * INV_CIRCLE_SAMPLES;
const GLOBAL_SCALE = 40;
const WAVEFORM_HALF_HEIGHT = 50;
const HEIGHT_ADJUST = -100;  // 100 for adjustment - arbitrary
const RADIUS_BASE = 250;
const RADIUS_SCALE = 50;

class AudioVisualizer extends React.Component {
    constructor(props) {
        super(props);
        props.registerAnimationCallback(this.onAnalyze);
    }

    initializeVisualizer = async () => {
        this.height = this.visualization.offsetHeight;
        this.width = this.visualization.offsetWidth;
        this.visualization.height = this.height;
        this.visualization.width = this.width;
        this.center_x = this.width / 2;
        this.center_y = this.height / 2 + HEIGHT_ADJUST;
        this.visualizationCtx = this.visualization.getContext('2d');
        this.visualizationCtx.globalCompositionOperation = "lighter";
        this.lastPlayheadPosition = 0;
        // high frequency visualization uses a 30 element running average
        // so the color doesn't jitter around so much.
        this.lastHighFreqs = new Array(30);
        this.lastHighFreqs.fill(0);

        try {
            await Promise.all([constantQ.loaded, firLoader.loaded]);

            const cq = constantQ.matrix;
            this.frequencyData = new Uint8Array(constantQ.numRows);
            this.FFT_HALF_SIZE = constantQ.numRows;
            this.CQ_BINS = constantQ.numCols * 2;
            this.INV_CQ_BINS = 1 / this.CQ_BINS;

            this.MAX_BIN = this.FFT_HALF_SIZE * 22050 / (constantQ.sampleRate / 2);
            this.HIGH_PASS_BIN = constantQ.maxF * this.FFT_HALF_SIZE / (constantQ.sampleRate / 2);
            this.LOW_PASS_BIN = constantQ.minF * this.FFT_HALF_SIZE / (constantQ.sampleRate / 2);

            this.NUM_CROSSINGS = firLoader.numCrossings;
            this.SAMPLES_PER_CROSSING = firLoader.samplesPerCrossing;
            this.firCoeffs = Float32Array.from(firLoader.coeffs);
            this.firDeltas = Float32Array.from(firLoader.deltas);
            this.HALF_CROSSINGS = firLoader.halfCrossings
            this.FILTER_SIZE = firLoader.filterSize;
            this.STEP_SIZE = this.CQ_BINS / CIRCLE_SAMPLES;
        } catch (err) {
            console.error('visualizer init failed.', err);
        }
    }

    accumulateLowHighFreq = (acc, value, index) => {
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
    }

    onAnalyze = (timestamp = 0) => {
        this.props.analyzers[0].getByteFrequencyData(this.frequencyData);
        const normalizedDataL = Float32Array.from(this.frequencyData, (number, index) => number / 255);

        this.props.analyzers[1].getByteFrequencyData(this.frequencyData);
        const normalizedDataR = Float32Array.from(this.frequencyData, (number, index) => number / 255);

        const accumulatorL = normalizedDataL.reduce(this.accumulateLowHighFreq, {
            highFreq: 0,
            lowFreq: 0,
            highFreqCount: 0,
            lowFreqCount: 0
        });
        const resultL = constantQ.apply(normalizedDataL);

        const accumulatorR = normalizedDataR.reduce(this.accumulateLowHighFreq, {
            highFreq: 0,
            lowFreq: 0,
            highFreqCount: 0,
            lowFreqCount: 0
        });
        const resultR = constantQ.apply(normalizedDataR).reverse();
        const result = Float32Array.from([...resultL, ...resultR]);

        let highFreq = (accumulatorL.highFreq + accumulatorR.highFreq) / (2 * (this.MAX_BIN - this.HIGH_PASS_BIN));
        let lowFreq = (accumulatorL.lowFreq + accumulatorR.lowFreq) / (2 * this.LOW_PASS_BIN);
        this.lastHighFreqs.shift();
        this.lastHighFreqs.push(highFreq);
        highFreq = this.lastHighFreqs.reduce((acc, value) => {
            return acc + value;
        }, 0) / this.lastHighFreqs.length;

        this.drawVisualization(this.visualizationCtx, lowFreq, result, 10 * highFreq, timestamp);
        this.requestId = requestAnimationFrame(this.onAnalyze);
        this.props.storeAnimationRequestId(this.requestId);
    }

    drawConstantQBins = (context, values, radius, color) => {
        context.beginPath();
        let currentInput = 0;
        let currentSample = 0;
        let currentFraction = 0;

        while (currentSample < CIRCLE_SAMPLES && currentInput < this.CQ_BINS) {
            let index = currentFraction * this.SAMPLES_PER_CROSSING;
            const integralPart = Math.floor(index);
            const fractionalPart = index - integralPart;
            let sum = 0;
            for (let i = integralPart, x = this.HALF_CROSSINGS; i < this.FILTER_SIZE; i += this.SAMPLES_PER_CROSSING, x--) {
                let input = currentInput + x;
                // treat like ring buffer
                if (input < 0) {
                    input += this.CQ_BINS;
                } else if (input >= this.CQ_BINS) {
                    input -= this.CQ_BINS;
                }
                const scale = values[input];
                sum += scale * (this.firCoeffs[i] + fractionalPart * this.firDeltas[i]);
            }
            const result = this.props.volume * sum * GLOBAL_SCALE;
            // first term is the actual incrementing.
            // second term is adjusting so that the visualization is symmetric
            // third term is adjusting so it starts at the bottom of the screen.
            const angle = (currentSample * TWO_PI_PER_CIRCLE_SAMPLES) + (TWO_PI * this.INV_CQ_BINS) + HALF_PI;
            const [x, y] = polarToCartesian((radius + result), angle, [this.center_x, this.center_y]);

            // if first sample, use moveTo instead of lineTo
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

    drawWaveForm = (context, centerAxis, color) => {
        const waveform = waveformLoader.waveform;
        if (waveform.length === 0) return;
        const waveformLength = waveform.length / 2;
        const twoPiPerWaveformLength = TWO_PI / waveformLength;
        context.beginPath();
        // going through mins from start to end
        for (let j = 0; j < waveformLength; j++) {
            const angle = -HALF_PI + ((j + 0.5) * twoPiPerWaveformLength);  // progress through waveform converted to angle
            const scale = centerAxis + waveform[j * 2] * this.props.volume * WAVEFORM_HALF_HEIGHT;
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
            const scale = centerAxis + waveform[j * 2 + 1] * this.props.volume * WAVEFORM_HALF_HEIGHT;
            const [x, y] = polarToCartesian(scale, angle, [this.center_x, this.center_y]);

            context.lineTo(x, y);
        }
        context.fillStyle = color;
        context.fill();
    }

    drawPlaybackHead = (context, angle, minRad, maxRad, color) => {
        const [xStart, yStart] = polarToCartesian(minRad, angle, [this.center_x, this.center_y]);
        const [xEnd, yEnd] = polarToCartesian(maxRad, angle, [this.center_x, this.center_y]);
        context.beginPath();
        context.moveTo(xStart, yStart);
        context.lineTo(xEnd, yEnd);
        context.strokeStyle = color;
        context.stroke();
    }

    drawSeekArea = (context, radius, color, timestamp) => {
        const WAVEFORM_CENTER_AXIS = radius - WAVEFORM_HALF_HEIGHT;
        this.drawWaveForm(context, WAVEFORM_CENTER_AXIS, color);

        // interpolate playbackhead position with timestamp difference if audio object hasn't updated current position
        let playbackHead = this.props.currentPosition;
        if (
            this.props.currentPosition &&
            this.props.currentPosition === this.lastPlayheadPosition &&
            this.props.isPlaying
        ) {
            playbackHead = this.props.currentPosition + (timestamp - this.props.prevTimestamp) / 1000;
        } else {
            this.lastPlayheadPosition = this.props.currentPosition;
        }
        const angle = (this.props.duration) ? -HALF_PI + TWO_PI * playbackHead / this.props.duration : 0;
        this.drawPlaybackHead(
            context,
            angle,
            WAVEFORM_CENTER_AXIS - this.props.volume * WAVEFORM_HALF_HEIGHT,
            WAVEFORM_CENTER_AXIS +this.props.volume * WAVEFORM_HALF_HEIGHT,
            "#FFF"
        );
        if (this.props.isHoverSeekring) {
            this.drawPlaybackHead(
                context,
                this.props.hoverAngle - HALF_PI,
                WAVEFORM_CENTER_AXIS - this.props.volume * WAVEFORM_HALF_HEIGHT,
                WAVEFORM_CENTER_AXIS + this.props.volume * WAVEFORM_HALF_HEIGHT,
                "#888"
            );
        }
    }

    drawVisualization = (context, lowFreq, values, lightness, timestamp) => {
        context.clearRect(0, 0, this.width, this.height);

        // hsl derived from @light-blue: #4E86A4;
        const color = `hsl(201, ${36 + lightness * 64}%, ${47 + lightness * 53}%)`;
        // adjust large radius to change with the average of all values
        const radius = RADIUS_BASE + lowFreq * RADIUS_SCALE;
        this.props.storeRadii(radius - 2 * WAVEFORM_HALF_HEIGHT, radius);

        this.drawConstantQBins(context, values, radius, color);
        drawCircleMask(context, radius, [this.center_x, this.center_y], [this.width, this.height]);
        this.drawSeekArea(context, radius, color, timestamp);
    }

    componentDidMount() {
        this.initializeVisualizer();
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.requestId);
    }

    shouldComponentUpdate(nextProps) {
        return false;
        //return this.props.waveformLoader !== nextProps.waveformLoader;
    }

    render() {
        return (
            <div className="visualizerContainer">
                <canvas className="visualization" ref={(canvas) => this.visualization = canvas}></canvas>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    currentPosition: state.audio_player.currentPosition,
    analyzers: state.audio_player.analyzers,
    isPlaying: state.audio_player.isPlaying,
    duration: state.audio_player.duration,
    prevTimestamp: state.audio_player.updateTimestamp,
    isHoverSeekring: state.audio_ui.isHoverSeekring,
    hoverAngle: state.audio_ui.angle,
    volume: state.audio_player.volume,
})

export default connect(
    mapStateToProps,
    {
        storeAnimationRequestId,
        storeRadii
    }
)(AudioVisualizer);