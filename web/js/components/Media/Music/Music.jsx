import '@/less/Media/media-content.less';
import '@/less/Media/Music/music.less';

import React from 'react';
import ReactDOM from 'react-dom';
import ConstantQ from '@/js/components/Media/Music/ConstantQ.js';
import { loadWaveformFile } from '@/js/components/Media/Music/WaveformLoader.js'
import AudioInfo from '@/js/components/Media/Music/AudioInfo.jsx';

// const url = 'http://seanchenpiano.com/musicfiles/composing/improv.mp3';
const demo = {
    url: '/music/spellbound.mp3',
    title: "Spellbound Concerto",
    composer: "Miklos Rosza",
    contributing: "New West Symphony",
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
        this.audio.addEventListener('play', this.onAnalyze);
    }

    initializeVisualizer = () => {
        this.visualization = this.el.getElementsByClassName('visualization')[0];
        this.height = this.visualization.offsetHeight;
        this.width = this.visualization.offsetWidth;
        this.visualization.height = this.height;
        this.visualization.width = this.width;
        this.visualizationCtx = this.visualization.getContext('2d');
        this.visualizationCtx.globalCompositionOperation = "lighter";
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

        console.log(loadWaveformFile(demo.waveform));

        Promise.all([ConstantQ.loaded]).then(() => {
            this.audio.play();
            this.setState({ isPlaying: true });
        });

        window.audio = this.audio;
    }

    onAnalyze = () => {
        this.analyserL.getByteFrequencyData(this.frequencyData);

        const normalizedDataL = Float32Array.from(this.frequencyData, (number, index) => number / 255);
        let { averageL, highFreqL } = normalizedDataL.reduce((acc, value, index) => {
            acc[averageL] += value;
            if (index >= HIGH_PASS_BIN) {
                acc[highFreqL] += value;
            }
            return acc;
        }, { averageL: 0, highFreqL: 0 });

        averageL /= FFT_HALF_SIZE;
        highFreqL /= (FFT_HALF_SIZE - HIGH_PASS_BIN);
        const resultL = ConstantQ.apply(normalizedDataL);

        this.analyserR.getByteFrequencyData(this.frequencyData);
        const normalizedDataR = Float32Array.from(this.frequencyData, (number, index) => number / 255);
        let { averageR, highFreqR } = normalizedDataL.reduce((acc, value, index) => {
            acc[averageR] += value;
            if (index >= 1600) {
                acc[highFreqR] += value;
            }
            return acc;
        }, { averageR: 0, highFreqR: 0 });

        averageR /= FFT_HALF_SIZE;
        highFreqR /= (FFT_HALF_SIZE - HIGH_PASS_BIN);
        const resultR = ConstantQ.apply(normalizedDataR);

        const average = (averageL + averageR) / 2;
        const highFreq = (highFreqL + highFreqR) / 2;
        this.drawCircles(average, [resultL, resultR], highFreq);

        this.requestId = requestAnimationFrame(this.onAnalyze);
    }

    drawCircles = (radius, radii, lightness) => {
        const context = this.visualizationCtx
        context.clearRect(0, 0, this.width, this.height);

        const count = radii[0].length;
        const twoPi = 2 * Math.PI;
        const pi = Math.PI;
        const rad = 250 + radius * 100;     // adjust large radius

        for (let j = 0; j < 2; j++) {
            for (let i = 0; i < count; i++) {
                // if left channel, go up the left side (clockwise)
                // if right channel, go up the right side (counter-clockwise)
                const angle = Math.pow(-1, -j) * ((i + 0.5) * pi / count) + pi / 2;
                const scale = radii[j][i];

                const x = rad * Math.cos(angle) + this.width / 2;
                const y = rad * Math.sin(angle) + this.height / 2 - 100;
                const r = 40 * scale;

                context.beginPath();
                context.arc(x, y, r, 0, twoPi, false);
                // hsl derived from @light-blue: #4E86A4;
                context.fillStyle = `hsl(201, ${36 + lightness * 64}%, ${47 + lightness * 53}%)`;
                context.fill();
            }
        }

        context.save();
        context.beginPath();
        context.arc(this.width / 2, this.height / 2 - 100, rad, 0, twoPi);
        context.closePath();
        context.clip();
        context.clearRect(0, 0, this.width, this.height);
        context.restore();
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
