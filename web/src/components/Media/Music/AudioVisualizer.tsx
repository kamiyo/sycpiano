import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';

import { storeRadii, storeVerticalOffset } from 'src/components/Media/Music/actions';
import { constantQ, drawCircleMask, firLoader, waveformLoader } from 'src/components/Media/Music/VisualizationUtils';
import { GlobalStateShape } from 'src/types';
import { polarToCartesian } from 'src/utils';

import { screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight, playlistWidth } from 'src/styles/variables';

const TWO_PI = 2 * Math.PI;
const HALF_PI = Math.PI / 2;
const CIRCLE_SAMPLES = 2048;
const INV_CIRCLE_SAMPLES = 1 / CIRCLE_SAMPLES;
const TWO_PI_PER_CIRCLE_SAMPLES = TWO_PI * INV_CIRCLE_SAMPLES;
const GLOBAL_SCALE = 40;
const HEIGHT_ADJUST_MOBILE = -50;
const HEIGHT_ADJUST_DESKTOP = -100;
const HIGH_FREQ_SCALE = 10;

interface AudioVisualizerStateToProps {
    readonly isHoverSeekring: boolean;
    readonly hoverAngle: number;
}

interface AudioVisualizerDispatchToProps {
    readonly storeRadii: typeof storeRadii;
    readonly storeVerticalOffset: typeof storeVerticalOffset;
}

interface AudioVisualizerOwnProps {
    readonly analyzers: AnalyserNode[];
    readonly currentPosition: number;
    readonly duration: number;
    readonly isPlaying: boolean;
    readonly prevTimestamp: number;
    readonly volume: number;
    readonly isMobile: boolean;
}

type AudioVisualizerProps = AudioVisualizerStateToProps & AudioVisualizerDispatchToProps & AudioVisualizerOwnProps;

const VisualizerContainer = styled<{ isMobile: boolean; }, 'div'>('div') `
    position: absolute;
    left: 0;
    top: 0;
    width: calc(100% - ${playlistWidth}px);
    height: 100%;

    ${/* sc-selector */ screenXSorPortrait} {
        width: 100%;
        height: 450px;
        top: ${navBarHeight.mobile}px;
    }
`;

const VisualizerCanvas = styled('canvas') `
    position: absolute;
    width: 100%;
    height: 100%;
`;

class AudioVisualizer extends React.Component<AudioVisualizerProps> {
    lastPlayheadPosition = 0;
    height: number;
    width: number;
    visualization: React.RefObject<HTMLCanvasElement> = React.createRef();
    centerX: number;
    centerY: number;
    RADIUS_SCALE: number;
    RADIUS_BASE: number;
    WAVEFORM_HALF_HEIGHT: number;
    HEIGHT_ADJUST: number;
    visualizationCtx: CanvasRenderingContext2D;

    frequencyData: Uint8Array;
    FFT_HALF_SIZE: number;
    CQ_BINS: number;
    INV_CQ_BINS: number;

    MAX_BIN: number;
    HIGH_PASS_BIN: number;
    LOW_PASS_BIN: number;

    NUM_CROSSINGS: number;
    SAMPLES_PER_CROSSING: number;
    HALF_CROSSINGS: number;
    FILTER_SIZE: number;
    firCoeffs: Float32Array;
    firDeltas: Float32Array;

    STEP_SIZE: number;
    requestId: number;

    adjustHeight = () => {
        this.HEIGHT_ADJUST = this.props.isMobile ? HEIGHT_ADJUST_MOBILE : HEIGHT_ADJUST_DESKTOP;
        this.props.storeVerticalOffset(this.HEIGHT_ADJUST);
    }

    initializeVisualizer = async () => {
        this.adjustHeight();
        this.onResize();
        this.visualizationCtx = this.visualization.current.getContext('2d');

        try {
            await Promise.all([constantQ.loaded, firLoader.loaded]);

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
            this.HALF_CROSSINGS = firLoader.halfCrossings;
            this.FILTER_SIZE = firLoader.filterSize;
            this.STEP_SIZE = this.CQ_BINS / CIRCLE_SAMPLES;

            this.requestId = requestAnimationFrame(this.onAnalyze);
        } catch (err) {
            console.error('visualizer init failed.', err);
        }
    }

    accumulateLowHighFreq = (acc: { highFreq: number; lowFreq: number }, value: number, index: number) => {
        if (value !== 0) {
            if (index >= this.HIGH_PASS_BIN) {
                acc.highFreq += value;
            }
            if (index < this.LOW_PASS_BIN) {
                acc.lowFreq += value;
            }
        }
        return acc;
    }

    onAnalyze = (timestamp = 0) => {
        // don't render anything if analyzers are null, i.e. audio not set up yet
        if (!this.props.analyzers[0] || !this.props.analyzers[1]) {
            this.requestId = requestAnimationFrame(this.onAnalyze);
            return;
        }

        this.props.analyzers[0].getByteFrequencyData(this.frequencyData);
        const normalizedDataL = Float32Array.from(this.frequencyData, (num) => num / 255);

        this.props.analyzers[1].getByteFrequencyData(this.frequencyData);
        const normalizedDataR = Float32Array.from(this.frequencyData, (num) => num / 255);

        const accumulatorL = normalizedDataL.reduce(this.accumulateLowHighFreq, {
            highFreq: 0,
            lowFreq: 0,
        });
        const resultL = constantQ.apply(normalizedDataL);

        const accumulatorR = normalizedDataR.reduce(this.accumulateLowHighFreq, {
            highFreq: 0,
            lowFreq: 0,
        });
        const resultR = constantQ.apply(normalizedDataR).reverse();
        const result = Float32Array.from([...resultL, ...resultR]);

        let highFreq = (accumulatorL.highFreq + accumulatorR.highFreq) / (2 * (this.MAX_BIN - this.HIGH_PASS_BIN));
        const lowFreq = (accumulatorL.lowFreq + accumulatorR.lowFreq) / (2 * this.LOW_PASS_BIN);
        highFreq = HIGH_FREQ_SCALE * highFreq;

        this.drawVisualization(this.visualizationCtx, lowFreq, result, highFreq, timestamp);
        this.requestId = requestAnimationFrame(this.onAnalyze);
    }

    drawConstantQBins = (context: CanvasRenderingContext2D, values: Float32Array, radius: number, color: string) => {
        context.beginPath();
        let currentInput = 0;
        let currentSample = 0;
        let currentFraction = 0;

        while (currentSample < CIRCLE_SAMPLES && currentInput < this.CQ_BINS) {
            const index = currentFraction * this.SAMPLES_PER_CROSSING;
            const integralPart = Math.floor(index);
            const fractionalPart = index - integralPart;
            let sum = 0;
            for (let i = integralPart, j = this.HALF_CROSSINGS; i < this.FILTER_SIZE; i += this.SAMPLES_PER_CROSSING, j--) {
                let input = currentInput + j;
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
            const [x, y] = polarToCartesian((radius + result), angle, [this.centerX, this.centerY]);

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

    drawWaveForm = (context: CanvasRenderingContext2D, centerAxis: number, color: string) => {
        const waveform = waveformLoader.waveform;
        if (!waveform || waveform.length === 0) {
            return;
        }

        const waveformLength = waveform.length / 2;
        const twoPiPerWaveformLength = TWO_PI / waveformLength;
        context.beginPath();
        // going through mins from start to end
        for (let j = 0; j < waveformLength; j++) {
            const angle = -HALF_PI + ((j + 0.5) * twoPiPerWaveformLength);  // progress through waveform converted to angle
            const scale = centerAxis + waveform[j * 2] * this.props.volume * this.WAVEFORM_HALF_HEIGHT;
            const [x, y] = polarToCartesian(scale, angle, [this.centerX, this.centerY]);

            if (j === 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
        }

        // looping around maxes from end to start
        for (let j = waveformLength - 1; j >= 0; j--) {
            const angle = -HALF_PI + ((j + 0.5) * twoPiPerWaveformLength);  // progress through waveform converted to angle
            const scale = centerAxis + waveform[j * 2 + 1] * this.props.volume * this.WAVEFORM_HALF_HEIGHT;
            const [x, y] = polarToCartesian(scale, angle, [this.centerX, this.centerY]);

            context.lineTo(x, y);
        }
        context.fillStyle = color;
        context.fill();
    }

    drawPlaybackHead = (context: CanvasRenderingContext2D, angle: number, minRad: number, maxRad: number, color: string) => {
        const [xStart, yStart] = polarToCartesian(minRad, angle, [this.centerX, this.centerY]);
        const [xEnd, yEnd] = polarToCartesian(maxRad, angle, [this.centerX, this.centerY]);
        context.beginPath();
        context.moveTo(xStart, yStart);
        context.lineTo(xEnd, yEnd);
        context.strokeStyle = color;
        context.stroke();
    }

    drawSeekArea = (context: CanvasRenderingContext2D, radius: number, color: string, timestamp: number) => {
        const WAVEFORM_CENTER_AXIS = radius - this.WAVEFORM_HALF_HEIGHT;
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
            WAVEFORM_CENTER_AXIS - this.props.volume * this.WAVEFORM_HALF_HEIGHT,
            WAVEFORM_CENTER_AXIS + this.props.volume * this.WAVEFORM_HALF_HEIGHT,
            '#FFF',
        );
        if (this.props.isHoverSeekring) {
            this.drawPlaybackHead(
                context,
                this.props.hoverAngle - HALF_PI,
                WAVEFORM_CENTER_AXIS - this.props.volume * this.WAVEFORM_HALF_HEIGHT,
                WAVEFORM_CENTER_AXIS + this.props.volume * this.WAVEFORM_HALF_HEIGHT,
                '#888',
            );
        }
    }

    drawVisualization = (context: CanvasRenderingContext2D, lowFreq: number, values: Float32Array, lightness: number, timestamp: number) => {
        context.clearRect(0, 0, this.width, this.height);

        // hsl derived from @light-blue: #4E86A4;
        const color = `hsl(201, ${36 + lightness * 64}%, ${47 + lightness * 53}%)`;
        // adjust large radius to change with the average of all values
        const radius = this.RADIUS_BASE + lowFreq * this.RADIUS_SCALE;
        this.props.storeRadii(radius - 2 * this.WAVEFORM_HALF_HEIGHT, radius, this.RADIUS_BASE);

        this.drawConstantQBins(context, values, radius, color);
        drawCircleMask(context, radius, [this.centerX, this.centerY], [this.width, this.height]);
        this.drawSeekArea(context, radius, color, timestamp);
    }

    onResize = () => {
        this.height = this.visualization.current.offsetHeight;
        this.width = this.visualization.current.offsetWidth;
        this.visualization.current.height = this.height;
        this.visualization.current.width = this.width;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2 + this.HEIGHT_ADJUST;
        this.RADIUS_SCALE = Math.min(this.width, this.height) / 12;
        this.RADIUS_BASE = Math.min(this.centerX, this.centerY) - this.RADIUS_SCALE;
        this.WAVEFORM_HALF_HEIGHT = Math.min(50, this.RADIUS_BASE / 4);
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
        this.initializeVisualizer();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
        cancelAnimationFrame(this.requestId);
    }

    // dunno why it doens't work without this. onResize should be called anyways
    componentDidUpdate(prevProps: AudioVisualizerProps) {
        if (prevProps.isMobile !== this.props.isMobile) {
            this.adjustHeight();
            this.onResize();
        }
    }

    shouldComponentUpdate(nextProps: AudioVisualizerProps) {
        if (nextProps.isMobile !== this.props.isMobile) {
            return true;
        }
        return false;
    }

    render() {
        return (
            <VisualizerContainer isMobile={this.props.isMobile}>
                <VisualizerCanvas innerRef={this.visualization} />
            </VisualizerContainer>
        );
    }
}

const mapStateToProps = (state: GlobalStateShape) => ({
    isHoverSeekring: state.audio_ui.isHoverSeekring,
    hoverAngle: state.audio_ui.angle,
});

const mapDispatchToProps: AudioVisualizerDispatchToProps = {
    storeRadii,
    storeVerticalOffset,
};

export default connect<AudioVisualizerStateToProps, AudioVisualizerDispatchToProps>(
    mapStateToProps,
    mapDispatchToProps,
)(AudioVisualizer);
