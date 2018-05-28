import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';

import { storeVerticalOffset } from 'src/components/Media/Music/actions';
import { polarToCartesian, visibilityChangeApi } from 'src/components/Media/Music/utils';
import { constantQ, drawCircleMask, firLoader, waveformLoader } from 'src/components/Media/Music/VisualizationUtils';
import { GlobalStateShape } from 'src/types';

import { screenM, screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight, playlistContainerWidth } from 'src/styles/variables';

const TWO_PI = 2 * Math.PI;
const HALF_PI = Math.PI / 2;
const CIRCLE_SAMPLES = 512;
const INV_CIRCLE_SAMPLES = 1 / CIRCLE_SAMPLES;
const TWO_PI_PER_CIRCLE_SAMPLES = TWO_PI * INV_CIRCLE_SAMPLES;
const SCALE_DESKTOP = 40;
const SCALE_MOBILE = 20;
const HEIGHT_ADJUST_MOBILE = -50;
const HEIGHT_ADJUST_DESKTOP = -100;
const HIGH_FREQ_SCALE = 10;

interface AudioVisualizerStateToProps {
    readonly isHoverSeekring: boolean;
    readonly hoverAngle: number;
}

interface AudioVisualizerDispatchToProps {
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
    readonly storeRadii: (inner: number, outer: number, base: number) => void;
}

type AudioVisualizerProps = AudioVisualizerStateToProps & AudioVisualizerDispatchToProps & AudioVisualizerOwnProps;

const VisualizerContainer = styled<{ isMobile: boolean; }, 'div'>('div')`
    position: absolute;
    left: 0;
    top: 0;
    width: calc(100% - ${playlistContainerWidth.desktop});
    height: 100%;

    ${/* sc-selector */ screenM} {
        width: calc(100% - ${playlistContainerWidth.tablet});
    }

    ${/* sc-selector */ screenXSorPortrait} {
        width: 100%;
        height: 450px;
        top: ${navBarHeight.mobile}px;
    }
`;

const VisualizerCanvas = styled('canvas')`
    position: absolute;
    width: 100%;
    height: 100%;
`;

class AudioVisualizer extends React.Component<AudioVisualizerProps> {
    lastPlayheadPosition = 0;
    height: number;
    width: number;
    visualization: React.RefObject<HTMLCanvasElement> = React.createRef();
    container: React.RefObject<HTMLDivElement> = React.createRef();
    SCALE: number;
    RADIUS_SCALE: number;
    RADIUS_BASE: number;
    WAVEFORM_HALF_HEIGHT: number;
    HEIGHT_ADJUST: number;
    visualizationCtx: CanvasRenderingContext2D;

    frequencyData: Uint8Array;
    FFT_HALF_SIZE: number;
    CQ_BINS: number;
    INV_CQ_BINS: number;

    normalizedL: Float32Array;
    normalizedR: Float32Array;
    vizBins: Float32Array;

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
    lastIsHover: boolean = false;
    lastHover: number = 0;
    lastCurrentPosition: number = 0;
    idleStart: number = 0;
    requestId: number = -1;
    lastCallback: number;

    adjustHeight = () => {
        this.HEIGHT_ADJUST = this.props.isMobile ? HEIGHT_ADJUST_MOBILE : HEIGHT_ADJUST_DESKTOP;
        this.SCALE = this.props.isMobile ? SCALE_MOBILE : SCALE_DESKTOP;
        this.props.storeVerticalOffset(this.HEIGHT_ADJUST);
    }

    initializeVisualizer = async () => {
        this.visualizationCtx = this.visualization.current.getContext('2d');
        this.visualizationCtx.save();
        this.adjustHeight();
        this.onResize();

        try {
            await Promise.all([constantQ.loaded, firLoader.loaded]);

            this.FFT_HALF_SIZE = constantQ.numRows;
            this.frequencyData = new Uint8Array(this.FFT_HALF_SIZE);
            this.CQ_BINS = constantQ.numCols * 2;
            this.INV_CQ_BINS = 1 / this.CQ_BINS;

            // set MaxDesiredFreq to 22050 (nyquist limit of 44.1k).
            // Therefore the bin of MaxDesiredFreq must be 22050/(sr/2) percent of total bin_size.
            // bin number of MaxFreq = numBins * MaxDesiredFreq / AbsMaxFreq
            const sr2 = constantQ.sampleRate / 2;
            this.MAX_BIN = Math.round(this.FFT_HALF_SIZE * 22050 / sr2);
            this.HIGH_PASS_BIN = Math.round(constantQ.maxF * this.FFT_HALF_SIZE / sr2);
            this.LOW_PASS_BIN = Math.round(constantQ.minF * this.FFT_HALF_SIZE / sr2);

            this.NUM_CROSSINGS = firLoader.numCrossings;
            this.SAMPLES_PER_CROSSING = firLoader.samplesPerCrossing;
            this.firCoeffs = Float32Array.from(firLoader.coeffs);
            this.firDeltas = Float32Array.from(firLoader.deltas);
            this.HALF_CROSSINGS = firLoader.halfCrossings;
            this.FILTER_SIZE = firLoader.filterSize;
            this.STEP_SIZE = this.CQ_BINS / CIRCLE_SAMPLES;
            // create visualization arrays here instead of new ones each loop
            // saves on overhead/allocation
            this.vizBins = new Float32Array(this.CQ_BINS);
            this.normalizedL = new Float32Array(this.FFT_HALF_SIZE);
            this.normalizedR = new Float32Array(this.FFT_HALF_SIZE);

            if (!this.requestId) {
                this.requestId = requestAnimationFrame(this.onAnalyze);
            }
        } catch (err) {
            console.error('visualizer init failed.', err);
        }
    }

    onAnalyze = (timestamp = 0) => {
        this.requestId = requestAnimationFrame(this.onAnalyze);
        // don't render anything if analyzers are null, i.e. audio not set up yet
        // also limit 30fps on mobile =).
        if (!this.props.analyzers[0] || !this.props.analyzers[1] ||
            this.props.isMobile && this.lastCallback && (timestamp - this.lastCallback) < (1000 / 30)
        ) {
            return;
        } else {

            this.lastCallback = timestamp;

            if (!this.props.isPlaying) {
                // reset idleStart time if either hover, hoverangle, or currPos changes
                if (this.lastIsHover !== this.props.isHoverSeekring ||
                    this.lastCurrentPosition !== this.props.currentPosition ||
                    this.lastHover !== this.props.hoverAngle
                ) {
                    this.idleStart = timestamp;
                }
                // update hover, hoverangle, currPos (no effect obviously if no change)
                this.lastIsHover = this.props.isHoverSeekring;
                this.lastHover = this.props.hoverAngle;
                this.lastCurrentPosition = this.props.currentPosition;
                // if has been idle for over 3.5 seconds, cancel animation
                if (this.idleStart !== 0 && (timestamp - this.idleStart > 3500)) {
                    cancelAnimationFrame(this.requestId);
                    this.requestId = 0;
                    return;
                }
            }

            // accumulators
            const lowFreqs = {
                l: 0,
                r: 0,
            };

            const highFreqs = {
                l: 0,
                r: 0,
            };

            // get byte data, and store into normalized[L,R], while accumulating
            this.props.analyzers[0].getByteFrequencyData(this.frequencyData);
            this.normalizedL.forEach((_, index, arr) => {
                const temp = this.frequencyData[index] / 255;
                arr[index] = temp;
                // accumulate
                if (index < this.MAX_BIN) {
                    index && (lowFreqs.l += temp);
                    (index >= this.HIGH_PASS_BIN) && (highFreqs.l += temp);
                }
            });

            this.props.analyzers[1].getByteFrequencyData(this.frequencyData);
            this.normalizedR.forEach((_, index, arr) => {
                const temp = this.frequencyData[index] / 255;
                arr[index] = temp;
                // accumulate
                if (index < this.MAX_BIN) {
                    index && (lowFreqs.r += temp);
                    (index >= this.HIGH_PASS_BIN) && (highFreqs.r += temp);
                }
            });

            // FFT -> CQ
            const resultL = constantQ.apply(this.normalizedL);
            const resultR = constantQ.apply(this.normalizedR).reverse();

            // concat the results, store in vizBins
            this.vizBins.set(resultL);
            this.vizBins.set(resultR, resultL.length);

            // Average left and right for each high and low accumulator, and divide by number of bins
            let highFreq = (highFreqs.l + highFreqs.r) / (2 * (this.MAX_BIN - this.HIGH_PASS_BIN));
            const lowFreq = (lowFreqs.l + lowFreqs.r) / (2 * this.HIGH_PASS_BIN);
            highFreq = HIGH_FREQ_SCALE * highFreq;

            this.drawVisualization(this.visualizationCtx, lowFreq, this.vizBins, highFreq, timestamp);
        }
    }

    drawConstantQBins = (context: CanvasRenderingContext2D, values: Float32Array, radius: number, color: string) => {
        context.beginPath();
        let currentInput = 0;
        let currentSample = 0;
        let currentFraction = 0;

        // "resampling" constantQ from CQ_BINS to CIRCLE_SAMPLES using FIR
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
            const result = this.props.volume * sum * this.SCALE;
            // first term is the actual incrementing.
            // second term is adjusting so that the visualization is symmetric
            // third term is adjusting so it starts at the bottom of the screen.
            const angle = (currentSample * TWO_PI_PER_CIRCLE_SAMPLES) + (TWO_PI * this.INV_CQ_BINS) + Math.PI;
            const [x, y] = polarToCartesian((radius + result), angle);

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
        const volumeHeightScale = this.props.volume * this.WAVEFORM_HALF_HEIGHT;
        context.beginPath();
        // going through mins from start to end
        for (let j = 0; j < waveformLength; j++) {
            const angle = ((j + 0.5) * twoPiPerWaveformLength);  // progress through waveform converted to angle
            const scale = centerAxis + waveform[j * 2] * volumeHeightScale;
            const [x, y] = polarToCartesian(scale, angle);

            if (j === 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
        }

        // looping around maxes from end to start
        for (let j = waveformLength - 1; j >= 0; j--) {
            const angle = ((j + 0.5) * twoPiPerWaveformLength);  // progress through waveform converted to angle
            const scale = centerAxis + waveform[j * 2 + 1] * volumeHeightScale;
            const [x, y] = polarToCartesian(scale, angle);

            context.lineTo(x, y);
        }
        context.fillStyle = color;
        context.fill();
    }

    drawPlaybackHead = (context: CanvasRenderingContext2D, angle: number, minRad: number, maxRad: number, color: string) => {
        const [xStart, yStart] = polarToCartesian(minRad, angle);
        const [xEnd, yEnd] = polarToCartesian(maxRad, angle);
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
        const angle = (this.props.duration) ? TWO_PI * playbackHead / this.props.duration : 0;
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
                this.props.hoverAngle,
                WAVEFORM_CENTER_AXIS - this.props.volume * this.WAVEFORM_HALF_HEIGHT,
                WAVEFORM_CENTER_AXIS + this.props.volume * this.WAVEFORM_HALF_HEIGHT,
                '#888',
            );
        }
    }

    drawVisualization = (context: CanvasRenderingContext2D, lowFreq: number, values: Float32Array, lightness: number, timestamp: number) => {
        context.clearRect(-this.width / 2, -this.height / 2 - this.HEIGHT_ADJUST, this.width, this.height);

        // hsl derived from @light-blue: #4E86A4;
        const color = `hsl(201, ${36 + lightness * 64}%, ${47 + lightness * 53}%)`;
        // adjust large radius to change with the average of all values
        const radius = this.RADIUS_BASE + lowFreq * this.RADIUS_SCALE;
        this.props.storeRadii(radius - 2 * this.WAVEFORM_HALF_HEIGHT, radius, this.RADIUS_BASE);

        this.drawConstantQBins(context, values, radius, color);
        drawCircleMask(context, radius + 1, [this.width, this.height]);
        this.drawSeekArea(context, radius, color, timestamp);
    }

    onResize = () => {
        this.visualizationCtx.restore();
        this.visualizationCtx.save();

        // scale canvas for high-resolution screens
        // code from https://gist.github.com/callumlocke/cc258a193839691f60dd
        const devicePixelRatio = window.devicePixelRatio || 1;
        const anyCtx: any = this.visualizationCtx;
        const backingStoreRatio = anyCtx.webkitBackingStorePixelRatio ||
            anyCtx.mozBackingStorePixelRatio ||
            anyCtx.msBackingStorePixelRatio ||
            anyCtx.oBackingStorePixelRatio ||
            anyCtx.backingStorePixelRatio || 1;

        const ratio = devicePixelRatio / backingStoreRatio;

        this.height = this.container.current.offsetHeight;
        this.width = this.container.current.offsetWidth;
        if (devicePixelRatio !== backingStoreRatio) {
            this.visualization.current.height = this.height * ratio;
            this.visualization.current.width = this.width * ratio;
            this.visualization.current.style.width = `${this.width}px`;
            this.visualization.current.style.height = `${this.height}px`;
            this.visualizationCtx.scale(ratio, ratio);
        } else {
            this.visualization.current.height = this.height;
            this.visualization.current.width = this.width;
            this.visualization.current.style.width = '';
            this.visualization.current.style.height = '';
        }

        const centerX = this.width / 2;
        const centerY = this.height / 2 + this.HEIGHT_ADJUST;

        // rotate so 0rad is up top
        this.visualizationCtx.rotate(-HALF_PI);
        // move so center is in center of canvas element (but since we rotated already,
        // we also need to rotate our translate [centerX, centerY] => [-centerY, centerX]
        this.visualizationCtx.translate(-centerY, centerX);

        this.RADIUS_SCALE = Math.min(this.width, this.height) / 12;
        this.RADIUS_BASE = Math.min(centerX, centerY) - this.RADIUS_SCALE;
        this.WAVEFORM_HALF_HEIGHT = Math.min(50, this.RADIUS_BASE / 4);
    }

    onVisibilityChange = () => {
        if ((document as any)[visibilityChangeApi.hidden]) {
            if (this.requestId) {
                cancelAnimationFrame(this.requestId);
                this.requestId = 0;
            }
        } else {
            if (!this.requestId) {
                this.requestId = requestAnimationFrame(this.onAnalyze);
            }
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
        document.addEventListener(visibilityChangeApi.visibilityChange, this.onVisibilityChange, false);
        this.initializeVisualizer();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
        document.removeEventListener(visibilityChangeApi.visibilityChange, this.onVisibilityChange);
        cancelAnimationFrame(this.requestId);
        this.requestId = 0;
    }

    // dunno why it doens't work without this. onResize should be called anyways
    componentDidUpdate(prevProps: AudioVisualizerProps) {
        if (prevProps.isMobile !== this.props.isMobile) {
            this.adjustHeight();
            this.onResize();
        }
        if (!this.requestId) {
            this.requestId = requestAnimationFrame(this.onAnalyze);
        }
    }

    shouldComponentUpdate(nextProps: AudioVisualizerProps) {
        if (nextProps.isMobile !== this.props.isMobile ||
            nextProps.currentPosition !== this.props.currentPosition ||
            nextProps.isPlaying && !this.props.isPlaying ||
            nextProps.isHoverSeekring !== this.props.isHoverSeekring ||
            nextProps.hoverAngle !== this.props.hoverAngle
        ) {
            return true;
        }
        return false;
    }

    render() {
        return (
            <VisualizerContainer innerRef={this.container} isMobile={this.props.isMobile}>
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
    storeVerticalOffset,
};

export default connect<AudioVisualizerStateToProps, AudioVisualizerDispatchToProps>(
    mapStateToProps,
    mapDispatchToProps,
)(AudioVisualizer);
