import '@/less/Media/media-content.less';
import '@/less/Media/Music/music.less';

import React from 'react';
import ReactDOM from 'react-dom';
import { max, shuffle, sum } from 'lodash';
import $ from 'cash-dom';
import { ParticleExplosionsManager } from '@/js/components/Media/Music/Particles.js';
import ConstantQ from '@/js/components/Media/Music/ConstantQ.js';

// const url = 'http://seanchenpiano.com/musicfiles/composing/improv.mp3';
const url = '/music/improv.mp3';

class Music extends React.Component {
    togglePlaying = (event) => {
        if (event.keyCode == 32) {
            if (this.isPlaying) {
                this.audio.pause();
            } else {
                this.audio.play();
            }
            this.isPlaying = !this.isPlaying;
        }
    }

    componentDidMount() {
        this.$el = $(ReactDOM.findDOMNode(this));
        this.$audio = this.$el.find('audio').first();
        this.audio = this.$audio.get(0);
        this.audio.src = url;
        this.requestId = null;
        this.isPlaying = false;
        this.$visualization = this.$el.find('.visualization').first();
        this.visualization = this.$visualization.get(0);

        this.height = this.$visualization.height();
        this.width = this.$visualization.width();
        this.visualization.height = this.height;
        this.visualization.width = this.width;
        this.visualizationCtx = this.visualization.getContext('2d');
        this.visualizationCtx.globalCompositionOperation = "lighter";

        this.explosions = new ParticleExplosionsManager(this.visualizationCtx);

        this.$audio.on('loadeddata', () => {
            const audioCtx = new AudioContext();
            const audioSrc = audioCtx.createMediaElementSource(this.audio);
            this.analyser = audioCtx.createAnalyser();
            // we have to connect the MediaElementSource with the analyser
            audioSrc.connect(this.analyser);
            this.analyser.connect(audioCtx.destination);
            this.analyser.fftSize = 16384;
            this.analyser.smoothingTimeConstant = 0.5;

            // frequencyBinCount tells you how many values you'll receive from the analyser
            this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

            this.audio.volume = 1;
            ConstantQ.loaded.then(() => {this.audio.play(); this.isPlaying = true;});
            window.audio = this.audio;

            this.lastUpdateTime = null;
            this.lastTimeAboveThresh = null;
            // this.newCenterIn = 1 + Math.random() * 25;
            // this.explosionCenterX = this.width / 2;
            // this.explosionCenterY = this.height / 2;
            this.minDb = this.analyser.minDecibels;
            this.rangeDb = this.analyser.maxDecibels - this.minDb;

            this.$audio.on('play', () => {
                this.onAnalyze();
            });

            window.addEventListener('keydown', this.togglePlaying);
        });
    }

    onAnalyze() {
        this.analyser.getByteFrequencyData(this.frequencyData)
        const normalizedData = Float32Array.from(this.frequencyData, (number, index) => number / 255);
        let average = 0;
        let highFreq = 0;
        normalizedData.forEach((value, index) => { average += value; if (index >= 1600) highFreq += value; });
        average /= normalizedData.length;
        highFreq /= (normalizedData.length - 1600);
        this.result = ConstantQ.apply(normalizedData);
        this.drawCircles(250 + average * 100, this.result, highFreq);

        // const now = Date.now();
        // const deltaMs = this.lastTimeAboveThresh ? now - this.lastTimeAboveThresh : 0;

        // if (max(this.frequencyData) < 150) {
        //     if (deltaMs > 1000) {
        //         this.createExplosion(this.frequencyData);
        //     }
        // } else {
        //     this.lastTimeAboveThresh = now;
        //     this.createExplosion(this.frequencyData);
        // }

        // // this.createExplosion(this.frequencyData);

        // this.update();
        this.requestId = requestAnimationFrame(this.onAnalyze.bind(this));
    }

    update() {
        const context = this.visualizationCtx;

        context.clearRect(0, 0, this.width, this.height);
        const now = Date.now();
        const deltaMs = this.lastUpdateTime ? now - this.lastUpdateTime : 0;
        this.lastUpdateTime = now;
        this.explosions.update(deltaMs);
        this.newCenterIn--;

        if (this.newCenterIn <= 0) {
            this.explosionCenterX = Math.random() * this.width;
            this.explosionCenterY = Math.random() * this.height;
            this.newCenterIn = 1 + Math.random() * 25;
        }
    }

    createExplosion(data) {
        const randX = Math.random();
        const randY = Math.random();
        const maxAmplitude = max(data);

        const posX = Math.max(this.explosionCenterX + (randX - 0.5) / 0.5 * 100, 0);
        const posY = Math.max(this.explosionCenterY + (randY - 0.5) / 0.5 * 100, 0);

        const sizes = shuffle(data.slice(0, 128).map(d => 50 * -Math.log10(d / 255)));

        this.explosions.createExplosion(posX, posY, sizes);
    }

    drawCircles(radius, radii, lightness) {
        const context = this.visualization.getContext('2d');
        context.clearRect(0, 0, this.width, this.height);

        const count = radii.length;
        const twoPi = 2 * Math.PI;
        const pi = Math.PI;

        for (let j = 0; j < 2; j++) {
            for (let i = 0; i < count; i++) {
                const angle = i * pi / count + j * pi;
                // const scale = radii[i] / 255;
                const scale = radii[i];

                // const rad = radius + scale * radius;
                const rad = radius;

                const x = rad * Math.cos(angle) + this.width / 2;
                const y = rad * Math.sin(angle) + this.height / 2;
                const r = 40 * scale;

                // const x = (100 + radius * scale) * Math.cos(angle) + this.width / 2;
                // const y = (100 + radius * scale) * Math.sin(angle) + this.height / 2;
                // const r = 10;

                context.beginPath();
                context.arc(x, y, r, 0, twoPi, false);
                context.fillStyle = `hsl(201, ${36 + lightness * 64}%, ${47 + lightness * 53}%)`;
                context.fill();
            }
        }

        context.save();
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, radius, 0, twoPi);
        context.closePath();
        context.clip();
        context.clearRect(0, 0, this.width, this.height);
        context.restore();
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.requestId);
    }

    render() {
        return (
            <div className="mediaContent music">
                <audio id="audio" crossOrigin="anonymous"/>
                <canvas className="visualization"></canvas>
            </div>
            );
    }
}

export default Music;
