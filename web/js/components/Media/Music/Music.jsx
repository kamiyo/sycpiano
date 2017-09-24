import '@/less/Media/media-content.less';
import '@/less/Media/Music/music.less';

import React from 'react';
import ReactDOM from 'react-dom';
import ConstantQ from '@/js/components/Media/Music/ConstantQ.js';
import { loadWaveformFile, loadFIRFile } from '@/js/components/Media/Music/VisualizationUtils.js'
import AudioInfo from '@/js/components/Media/Music/AudioInfo.jsx';

// const url = 'http://seanchenpiano.com/musicfiles/composing/improv.mp3';
const demo = {
    url: '/music/spellbound.mp3',
    title: "Spellbound Concerto",
    composer: "Miklos Rosza",
    contributing: "New West Symphony",
    waveform: '/music/waveforms/spellbound.dat'
};

// Constants so we don't have to calculate in time-sensitive loops
// includes reciprocals so we just have to multiply instead of divide
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

class Music extends React.Component {
    state = {
        isPlaying: false
    };

    togglePlaying = (event) => {
        if (event.keyCode == 32) {
            if (this.state.isPlaying) {
                this.audio.pause();
                setTimeout(() => cancelAnimationFrame(this.requestId), 500);
            } else {
                this.audio.play();
            }
            this.setState({ isPlaying: !this.state.isPlaying });
        }
    }

    initializeAudioPlayer = () => {
        this.el = ReactDOM.findDOMNode(this);
        this.audio = this.el.getElementsByTagName('audio')[0];
        this.audio.src = demo.url;

        this.audio.addEventListener('loadeddata', this.audioOnLoad);
        this.audio.addEventListener('playing', this.onPlaying);
        this.audio.addEventListener('timeupdate', this.onTimeUpdate);
        this.audio.addEventListener('pause', this.onPause);
        this.audio.addEventListener('ended', this.onEnded);
    }

    initializeVisualizer = () => {
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
        this.prevTimestamp = 0;
    }

    onTimeUpdate = () => {
        this.currentPosition = this.audio.currentTime;
        this.audioDuration = this.audio.duration;
        this.prevTimestamp = performance.now();
    }

    onEnded = () => {
        this.setState({ isPlaying: false });
        this.prevTimestamp = performance.now();
        this.currentPosition = 0;
        setTimeout(() => cancelAnimationFrame(this.requestId), 500);
    }

    audioOnLoad = () => {
        // split src into channels to analyze separately, then merge back to destination
        const audioCtx = new AudioContext();
        const audioSrc = audioCtx.createMediaElementSource(this.audio);
        this.analyserL = audioCtx.createAnalyser();
        this.analyserR = audioCtx.createAnalyser();
        this.splitter = audioCtx.createChannelSplitter(2);
        this.merger = audioCtx.createChannelMerger(2);
        audioSrc.connect(this.splitter);
        this.splitter.connect(this.analyserL, 0);
        this.splitter.connect(this.analyserR, 1);
        this.analyserL.connect(this.merger, 0, 0);
        this.analyserR.connect(this.merger, 0, 1);
        this.merger.connect(audioCtx.destination);

        this.analyserL.fftSize = this.analyserR.fftSize = FFT_SIZE;
        this.analyserL.smoothingTimeConstant = this.analyserR.smoothingTimeConstant = SMOOTHING_CONSTANT;

        // frequencyBinCount tells you how many values you'll receive from the analyser
        // we're assuming L and R have same (and we defined it above as such)
        this.frequencyData = new Uint8Array(this.analyserL.frequencyBinCount);
        // Assume L and R analysers have also the same min and max db
        this.minDb = this.analyserL.minDecibels;
        this.rangeDb = this.analyserL.maxDecibels - this.minDb;

        this.audio.volume = 1;

        Promise.all([ConstantQ.loaded, loadWaveformFile(demo.waveform), loadFIRFile()]).then((data) => {
            let [cq, waveform, fir] = data;
            const maxAbs = waveform.body.values.reduce((acc, value) => {
                if (Math.abs(value) > acc) acc = value;
                return acc;
            }, 0);
            this.waveform = Float32Array.from(waveform.body.values, (number, index) => number / maxAbs);
            this.NUM_CROSSINGS = fir.numCrossings;
            this.SAMPLES_PER_CROSSING = fir.samplesPerCrossing;
            this.FIR = Float32Array.from(fir.values);
            this.HALF_CROSSINGS = Math.floor(this.NUM_CROSSINGS / 2);
            this.FILTER_SIZE = this.SAMPLES_PER_CROSSING * (this.NUM_CROSSINGS - 1) - 1;
            this.FILTER_CENTER = this.SAMPLES_PER_CROSSING * this.HALF_CROSSINGS - 1;
            this.audio.play();
            this.setState({ isPlaying: true });
        });

        window.audio = this.audio;
    }

    onPause = () => {
        this.prevTimestamp = performance.now();
        this.currentPosition = this.audio.currentTime;
    }

    onPlaying = () => {
        this.currentPosition = this.audio.currentTime;
        this.audioDuration = this.audio.duration;
        this.prevTimestamp = performance.now();
        this.onAnalyze();
    }

    onAnalyze = (timestamp) => {
        this.analyserL.getByteFrequencyData(this.frequencyData);
        const normalizedDataL = Float32Array.from(this.frequencyData, (number, index) => number / 255);

        this.analyserR.getByteFrequencyData(this.frequencyData);
        const normalizedDataR = Float32Array.from(this.frequencyData, (number, index) => number / 255);

        const accumulatorL = normalizedDataL.reduce((acc, value, index) => {
            acc.average += value;
            if (index >= HIGH_PASS_BIN) {
                acc.highFreq += value;
            }
            return acc;
        }, { average: 0, highFreq: 0 });
        const resultL = ConstantQ.apply(normalizedDataL);

        const accumulatorR = normalizedDataR.reduce((acc, value, index) => {
            acc.average += value;
            if (index >= HIGH_PASS_BIN) {
                acc.highFreq += value;
            }
            return acc;
        }, { average: 0, highFreq: 0 });
        const resultR = ConstantQ.apply(normalizedDataR).reverse();

        const result = Float32Array.from([...resultL, ...resultR]);
        const average = (accumulatorL.average + accumulatorR.average) * FFT_2_SCALE;
        const highFreq = (accumulatorL.highFreq + accumulatorR.highFreq) * FFT_2_SCALE_HF;
        this.drawVisualization(this.visualizationCtx, average, result, highFreq, timestamp);

        this.requestId = requestAnimationFrame(this.onAnalyze);
    }

    polarToCartesian = (radius, angle, offset) => (
        [
            radius * Math.cos(angle) + offset[0],
            radius * Math.sin(angle) + offset[1]
        ]
    )

    drawConstantQBins = (context, values, radius, color) => {
        context.beginPath();
        let currentInput = 0;
        let currentSample = 0;
        let currentFraction = 0.5;
        while (currentSample < CIRCLE_SAMPLES && currentInput < CQ_BINS) {
            let sum = 0;
            const currentFractionFrom1 = 1 - currentFraction;
            for (let i = -this.HALF_CROSSINGS; i < this.HALF_CROSSINGS; i++) {
                let input = currentInput + i;
                if (input < 0) {
                    input += CQ_BINS;
                } else if (input >= CQ_BINS) {
                    input -= CQ_BINS;
                }
                const scale = values[input];
                let indexToCoeff = Math.floor((i + currentFractionFrom1) * this.SAMPLES_PER_CROSSING + this.FILTER_CENTER);
                if (indexToCoeff >= this.FILTER_SIZE || indexToCoeff < 0) indexToCoeff = null;
                const firCoeff = (indexToCoeff) ? this.FIR[indexToCoeff] : 0;
                const result = scale * firCoeff;
                sum += result;
            }

            const result = sum * GLOBAL_SCALE;

            // if left channel, go up the left side (clockwise)
            // if right channel, go up the right side (counter-clockwise)
            const angle = (currentSample * TWO_PI_PER_CIRCLE_SAMPLES) + HALF_PI;    // 2pi * currentSample / CIRCLE_SAMPLES

            const [x, y] = this.polarToCartesian((radius + result), angle, [this.center_x, this.center_y]);

            if (currentSample === 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
            currentSample += 1;
            currentFraction += STEP_SIZE;
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
        const waveformLength = this.waveform.length / 2;
        const twoPiPerWaveformLength = TWO_PI / waveformLength;
        context.beginPath();
        // going through mins from start to end
        for (let j = 0; j < waveformLength; j++) {
            const angle = -HALF_PI + ((j + 0.5) * twoPiPerWaveformLength);  // progress through waveform converted to angle
            const scale = centerAxis + this.waveform[j * 2] * WAVEFORM_HALF_HEIGHT;
            const [x, y] = this.polarToCartesian(scale, angle, [this.center_x, this.center_y]);

            if (j === 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
        }

        // looping around maxes from end to start
        for (let j = waveformLength - 1; j >= 0; j--) {
            const angle = -HALF_PI + ((j + 0.5) * twoPiPerWaveformLength);  // progress through waveform converted to angle
            const scale = centerAxis + this.waveform[j * 2 + 1] * WAVEFORM_HALF_HEIGHT;
            const [x, y] = this.polarToCartesian(scale, angle, [this.center_x, this.center_y]);

            context.lineTo(x, y);
        }
        context.fillStyle = color;
        context.fill();
    }

    drawPlaybackHead = (context, playbackHead, minRad, maxRad) => {
        const angle = -HALF_PI + TWO_PI * playbackHead / this.audioDuration;
        const [xStart, yStart] = this.polarToCartesian(minRad, angle, [this.center_x, this.center_y]);
        const [xEnd, yEnd] = this.polarToCartesian(maxRad, angle, [this.center_x, this.center_y]);
        context.beginPath();
        context.moveTo(xStart, yStart);
        context.lineTo(xEnd, yEnd);
        context.strokeStyle = '#FFF';
        context.stroke();
    }

    drawSeekArea = (context, radius, color, timestamp) => {
        const WAVEFORM_CENTER_AXIS = radius - WAVEFORM_HALF_HEIGHT;
        this.drawWaveForm(context, WAVEFORM_CENTER_AXIS, color);

        let playbackHead = this.currentPosition;
        if (this.currentPosition === this.lastPosition && this.state.isPlaying) {
            playbackHead = this.currentPosition + (timestamp - this.prevTimestamp) / 1000;
        } else {
            this.lastPosition = this.currentPosition;
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
        this.initializeAudioPlayer();
        this.initializeVisualizer();

        window.addEventListener('keydown', this.togglePlaying);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.requestId);
    }

    render() {
        return (
            <div className="mediaContent music">
                <AudioInfo
                    title={demo.title}
                    composer={demo.composer}
                    contributing={demo.contributing}
                />
                <audio id="audio" crossOrigin="anonymous" />
                <canvas className="visualization"></canvas>
            </div>
        );
    }
}

export default Music;