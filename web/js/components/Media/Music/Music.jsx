import '@/less/Media/media-content.less';
import '@/less/Media/Music/music.less';

import React from 'react';
import ReactDOM from 'react-dom';
import ConstantQ from '@/js/components/Media/Music/ConstantQ.js';
import { loadWaveformFile, loadFIRFile } from '@/js/components/Media/Music/WaveformLoader.js'
import AudioInfo from '@/js/components/Media/Music/AudioInfo.jsx';

// const url = 'http://seanchenpiano.com/musicfiles/composing/improv.mp3';
const demo = {
    url: '/music/spellbound.mp3',
    title: "Improv",
    composer: "Sean Chen",
    contributing: "",
    waveform: '/music/waveforms/spellbound.dat'
};

const FFT_SIZE = 16384;
const FFT_HALF_SIZE = FFT_SIZE / 2;
const HIGH_PASS_BIN = 1600;

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
        this.analyserL.smoothingTimeConstant = this.analyserR.smoothingTimeConstant = 0.5;

        // frequencyBinCount tells you how many values you'll receive from the analyser
        // we're assuming L and R have same (and we defined it above as such)
        this.frequencyData = new Uint8Array(this.analyserL.frequencyBinCount);
        // Assume L and R analysers have also the same min and max db
        this.minDb = this.analyserL.minDecibels;
        this.rangeDb = this.analyserL.maxDecibels - this.minDb;

        this.audio.volume = 1;

        Promise.all([ConstantQ.loaded, loadWaveformFile(demo.waveform), loadFIRFile()]).then((data) => {
            const maxAbs = data[1].body.values.reduce((acc, value) => {
                if (Math.abs(value) > acc) acc = value;
                return acc;
            }, 0);
            this.waveform = Float32Array.from(data[1].body.values, (number, index) => number / maxAbs);
            this.FIR = Float32Array.from(data[2]);
            console.log(this.FIR);
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
        const accumulatorL = normalizedDataL.reduce((acc, value, index) => {
            acc.average += value;
            if (index >= HIGH_PASS_BIN) {
                acc.highFreq += value;
            }
            return acc;
        }, { average: 0, highFreq: 0 });
        const resultL = ConstantQ.apply(normalizedDataL);

        this.analyserR.getByteFrequencyData(this.frequencyData);
        const normalizedDataR = Float32Array.from(this.frequencyData, (number, index) => number / 255);
        const accumulatorR = normalizedDataR.reduce((acc, value, index) => {
            acc.average += value;
            if (index >= 1600) {
                acc.highFreq += value;
            }
            return acc;
        }, { average: 0, highFreq: 0 });
        const resultR = ConstantQ.apply(normalizedDataR).reverse();

        const result = Float32Array.from([...resultL, ...resultR]);
        const average = (accumulatorL.average + accumulatorR.average) / (2 * FFT_HALF_SIZE);
        const highFreq = (accumulatorL.highFreq + accumulatorR.highFreq) / (2 * (FFT_HALF_SIZE - HIGH_PASS_BIN));
        this.drawCircles(average, result, highFreq, timestamp);

        this.requestId = requestAnimationFrame(this.onAnalyze);
    }

    drawCircles = (radius, radii, lightness, timestamp) => {
        const context = this.visualizationCtx
        context.clearRect(0, 0, this.width, this.height);

        const count = radii.length;
        const twoPi = 2 * Math.PI;
        const pi = Math.PI;
        const rad = 250 + radius * 50;     // adjust large radius

        // for (let j = 0; j < 2; j++) {
        //     for (let i = 0; i < count; i++) {
        //         // if left channel, go up the left side (clockwise)
        //         // if right channel, go up the right side (counter-clockwise)
        //         const angle = Math.pow(-1, j) * ((i + 0.5) * pi / count) + pi / 2;
        //         const scale = radii[j][i];

        //         const x = rad * Math.cos(angle) + this.width / 2;
        //         const y = rad * Math.sin(angle) + this.height / 2 - 100;
        //         const r = 40 * scale;

        //         context.beginPath();
        //         context.arc(x, y, r, 0, twoPi, false);
        //         // hsl derived from @light-blue: #4E86A4;
        //         context.fillStyle = `hsl(201, ${36 + lightness * 64}%, ${47 + lightness * 53}%)`;
        //         context.fill();
        //     }
        // }
        context.beginPath();
        const CIRCLE_SAMPLES = 2048;
        const OVERSAMPLING_RATIO = CIRCLE_SAMPLES / count;
        const STEP_SIZE = 1 / OVERSAMPLING_RATIO;
        const SAMPLES_PER_CROSSING = 64;
        const NUM_CROSSINGS = 7;
        const HALF_CROSSINGS = Math.floor(NUM_CROSSINGS / 2);
        const FILTER_SIZE = SAMPLES_PER_CROSSING * (NUM_CROSSINGS - 1) - 1;
        const FILTER_CENTER = SAMPLES_PER_CROSSING * HALF_CROSSINGS - 1;
        const GLOBAL_SCALE = 40;
        let currentInput = 0;
        let currentSample = 0;
        let currentFraction = 0.5;
        while (currentSample < CIRCLE_SAMPLES && currentInput < count) {
            // console.log(currentFraction);
            let sum = 0;
            for (let i = -HALF_CROSSINGS; i < HALF_CROSSINGS; i++) {
                let input = currentInput + i;
                if (input < 0) {
                    input += count;
                } else if (input >= count) {
                    input -= count;
                }
                const scale = radii[input];
                let indexToCoeff = Math.floor((i + (1 - currentFraction)) * SAMPLES_PER_CROSSING + FILTER_CENTER);
                if (indexToCoeff >= FILTER_SIZE || indexToCoeff < 0) indexToCoeff = null;
                const firCoeff = (indexToCoeff) ? this.FIR[indexToCoeff] : 0;
                const result = scale * firCoeff;
                sum += result;
                // console.log(i, input, scale, indexToCoeff, firCoeff);
            }
            // console.log('sum', sum);
            // const scale0 = radii[(currentInput === -1) ? count - 1 : currentInput];
            // const scale1 = radii[(currentInput + 1) % count];
            // const indexToCoeff0 = Math.floor(FILTER_CENTER - currentFraction * SAMPLES_PER_CROSSING);
            // const indexToCoeff1 = (currentFraction === 0) ? null : Math.floor(FILTER_CENTER + (1 - currentFraction) * SAMPLES_PER_CROSSING);
            // console.log('indices', indexToCoeff0, indexToCoeff1);

            // const firCoeff0 = indexToCoeff0 === -1 ? 0 : this.FIR[indexToCoeff0];
            // const firCoeff1 = indexToCoeff1 ? this.FIR[indexToCoeff1] : 0;
            // console.log('coeffs', firCoeff0, firCoeff1);
            // console.log('scales', scale0, scale1);
            // const result = GLOBAL_SCALE * (scale0 * firCoeff0 + scale1 * firCoeff1);
            // console.log('result', result);

            const result = sum * GLOBAL_SCALE;


            // if left channel, go up the left side (clockwise)
            // if right channel, go up the right side (counter-clockwise)
            const angle = (currentSample * twoPi / CIRCLE_SAMPLES) + pi / 2;

            const x = (rad + result) * Math.cos(angle) + this.width / 2;
            const y = (rad + result) * Math.sin(angle) + this.height / 2 - 100;

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

        // hsl derived from @light-blue: #4E86A4;
        context.fillStyle = `hsl(201, ${36 + lightness * 64}%, ${47 + lightness * 53}%)`;
        context.fill();


        context.save();
        context.beginPath();
        context.arc(this.width / 2, this.height / 2 - 100, rad, 0, twoPi);
        context.closePath();
        context.clip();
        context.clearRect(0, 0, this.width, this.height);
        context.restore();

        const WAVEFORM_HALF_HEIGHT = 50
        const WAVEFORM_CENTER_AXIS = rad - WAVEFORM_HALF_HEIGHT;
        const waveformLength = this.waveform.length / 2;
        context.beginPath();
        for (let j = 0; j < waveformLength; j++) {
            const angle = -pi / 2 + ((j + 0.5) * twoPi / waveformLength);
            const scale = WAVEFORM_CENTER_AXIS + this.waveform[j * 2] * WAVEFORM_HALF_HEIGHT;
            const x = scale * Math.cos(angle) + this.width / 2;
            const y = scale * Math.sin(angle) + this.height / 2 - 100;

            if (j === 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
        }

        for (let j = waveformLength - 1; j >= 0; j--) {
            const angle = -pi / 2 + ((j + 0.5) * twoPi / waveformLength);
            const scale = WAVEFORM_CENTER_AXIS + this.waveform[j * 2 + 1] * WAVEFORM_HALF_HEIGHT;
            const x = scale * Math.cos(angle) + this.width / 2;
            const y = scale * Math.sin(angle) + this.height / 2 - 100;

            context.lineTo(x, y);
        }
        context.fillStyle = `hsl(201, ${36 + lightness * 64}%, ${47 + lightness * 53}%)`;
        context.fill();

        let playbackHead = this.currentPosition;
        if (this.currentPosition === this.lastPosition && this.state.isPlaying) {
            playbackHead = this.currentPosition + (timestamp - this.prevTimestamp) / 1000;
        } else {
            this.lastPosition = this.currentPosition;
        }

        const angle = -pi / 2 + twoPi * playbackHead / this.audioDuration;
        const radStart = WAVEFORM_CENTER_AXIS - WAVEFORM_HALF_HEIGHT;
        const radEnd = WAVEFORM_CENTER_AXIS + WAVEFORM_HALF_HEIGHT;
        const xStart = radStart * Math.cos(angle) + this.width / 2;
        const yStart = radStart * Math.sin(angle) + this.height / 2 - 100;
        const xEnd = radEnd * Math.cos(angle) + this.width / 2;
        const yEnd = radEnd * Math.sin(angle) + this.height / 2 - 100;
        context.beginPath();
        context.moveTo(xStart, yStart);
        context.lineTo(xEnd, yEnd);
        context.strokeStyle = '#FFF';
        context.stroke();

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
