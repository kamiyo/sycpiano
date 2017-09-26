import '@/less/Media/Music/visualizer.less';

import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { constantQ, firLoader, CONSTANTS, polarToCartesian } from '@/js/components/Media/Music/VisualizationUtils.js'
import { storeAnimationRequestId } from '@/js/components/Media/Music/actions.js'

class Visualizer extends React.Component {
    constructor(props) {
        super(props);
        props.registerPlayingCallback(this.onAnalyze);
    }

    initializeVisualizer = () => {
        console.log(CONSTANTS);
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
        this.frequencyData = new Uint8Array(CONSTANTS.FFT_HALF_SIZE);

        Promise.all([constantQ.loaded, firLoader.loaded, this.props.waveformLoader.loaded]).then((data) => {
            const cq = constantQ.matrix;
            const waveform = this.props.waveformLoader.waveform;
            const maxAbs = waveform.reduce((acc, value) => {
                if (Math.abs(value) > acc) acc = value;
                return acc;
            }, 0);
            this.waveform = Float32Array.from(waveform, (number, index) => number / maxAbs);
            this.NUM_CROSSINGS = firLoader.numCrossings;
            this.SAMPLES_PER_CROSSING = firLoader.samplesPerCrossing;
            this.FIR = Float32Array.from(firLoader.FIR);
            this.HALF_CROSSINGS = Math.floor(this.NUM_CROSSINGS / 2);
            this.FILTER_SIZE = this.SAMPLES_PER_CROSSING * (this.NUM_CROSSINGS - 1) - 1;
            this.FILTER_CENTER = this.SAMPLES_PER_CROSSING * this.HALF_CROSSINGS - 1;
        });
    }

    onAnalyze = (timestamp = 0) => {
        this.props.analyzers[0].getByteFrequencyData(this.frequencyData);
        const normalizedDataL = Float32Array.from(this.frequencyData, (number, index) => number / 255);

        this.props.analyzers[1].getByteFrequencyData(this.frequencyData);
        const normalizedDataR = Float32Array.from(this.frequencyData, (number, index) => number / 255);

        const accumulatorL = normalizedDataL.reduce((acc, value, index) => {
            acc.average += value;
            if (index >= CONSTANTS.HIGH_PASS_BIN) {
                acc.highFreq += value;
            }
            return acc;
        }, { average: 0, highFreq: 0 });
        const resultL = constantQ.apply(normalizedDataL);

        const accumulatorR = normalizedDataR.reduce((acc, value, index) => {
            acc.average += value;
            if (index >= CONSTANTS.HIGH_PASS_BIN) {
                acc.highFreq += value;
            }
            return acc;
        }, { average: 0, highFreq: 0 });
        const resultR = constantQ.apply(normalizedDataR).reverse();
        const result = Float32Array.from([...resultL, ...resultR]);
        const average = (accumulatorL.average + accumulatorR.average) * CONSTANTS.FFT_2_SCALE;
        const highFreq = (accumulatorL.highFreq + accumulatorR.highFreq) * CONSTANTS.FFT_2_SCALE_HF;
        console.log(CONSTANTS.FFT_2_SCALE, CONSTANTS.FFT_2_SCALE_HF);
        this.drawVisualization(this.visualizationCtx, average, result, highFreq, timestamp);

        this.requestId = requestAnimationFrame(this.onAnalyze);
        this.props.storeAnimationRequestId(this.requestId);
    }

    drawConstantQBins = (context, values, radius, color) => {
        context.beginPath();
        let currentInput = 0;
        let currentSample = 0;
        let currentFraction = 0.5;
        //interpolate between bins using FIR so we get smooth surface
        while (currentSample < CONSTANTS.CIRCLE_SAMPLES && currentInput < CONSTANTS.CQ_BINS) {
            let sum = 0;
            const currentFractionFrom1 = 1 - currentFraction;
            for (let i = -this.HALF_CROSSINGS; i < this.HALF_CROSSINGS; i++) {
                let input = currentInput + i;
                if (input < 0) {
                    input += CONSTANTS.CQ_BINS;
                } else if (input >= CONSTANTS.CQ_BINS) {
                    input -= CONSTANTS.CQ_BINS;
                }
                const scale = values[input];
                let indexToCoeff = Math.floor((i + currentFractionFrom1) * this.SAMPLES_PER_CROSSING + this.FILTER_CENTER);
                if (indexToCoeff >= this.FILTER_SIZE || indexToCoeff < 0) indexToCoeff = null;
                const firCoeff = (indexToCoeff) ? this.FIR[indexToCoeff] : 0;
                const result = scale * firCoeff;
                sum += result;
            }

            const result = sum * CONSTANTS.GLOBAL_SCALE;
            const angle = (currentSample * CONSTANTS.TWO_PI_PER_CIRCLE_SAMPLES) + CONSTANTS.HALF_PI;    // 2pi * currentSample / CIRCLE_SAMPLES
            const [x, y] = polarToCartesian((radius + result), angle, [this.center_x, this.center_y]);

            if (currentSample === 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
            // update for next sample
            currentSample += 1;
            currentFraction += CONSTANTS.STEP_SIZE;
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
        context.arc(this.center_x, this.center_y, radius, 0, CONSTANTS.TWO_PI);
        context.closePath();
        context.clip();
        context.clearRect(0, 0, this.width, this.height);
        context.restore();
    }

    drawWaveForm = (context, centerAxis, color) => {
        const waveformLength = this.waveform.length / 2;
        const twoPiPerWaveformLength = CONSTANTS.TWO_PI / waveformLength;
        context.beginPath();
        // going through mins from start to end
        for (let j = 0; j < waveformLength; j++) {
            const angle = -CONSTANTS.HALF_PI + ((j + 0.5) * twoPiPerWaveformLength);  // progress through waveform converted to angle
            const scale = centerAxis + this.waveform[j * 2] * CONSTANTS.WAVEFORM_HALF_HEIGHT;
            const [x, y] = polarToCartesian(scale, angle, [this.center_x, this.center_y]);

            if (j === 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
        }

        // looping around maxes from end to start
        for (let j = waveformLength - 1; j >= 0; j--) {
            const angle = -CONSTANTS.HALF_PI + ((j + 0.5) * twoPiPerWaveformLength);  // progress through waveform converted to angle
            const scale = centerAxis + this.waveform[j * 2 + 1] * CONSTANTS.WAVEFORM_HALF_HEIGHT;
            const [x, y] = polarToCartesian(scale, angle, [this.center_x, this.center_y]);

            context.lineTo(x, y);
        }
        context.fillStyle = color;
        context.fill();
    }

    drawPlaybackHead = (context, playbackHead, minRad, maxRad) => {
        const angle = (this.props.duration) ? -CONSTANTS.HALF_PI + CONSTANTS.TWO_PI * playbackHead / this.props.duration : 0;
        const [xStart, yStart] = polarToCartesian(minRad, angle, [this.center_x, this.center_y]);
        const [xEnd, yEnd] = polarToCartesian(maxRad, angle, [this.center_x, this.center_y]);
        context.beginPath();
        context.moveTo(xStart, yStart);
        context.lineTo(xEnd, yEnd);
        context.strokeStyle = '#FFF';
        context.stroke();
    }

    drawSeekArea = (context, radius, color, timestamp) => {
        const WAVEFORM_CENTER_AXIS = radius - CONSTANTS.WAVEFORM_HALF_HEIGHT;
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
            WAVEFORM_CENTER_AXIS - CONSTANTS.WAVEFORM_HALF_HEIGHT,
            WAVEFORM_CENTER_AXIS + CONSTANTS.WAVEFORM_HALF_HEIGHT
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