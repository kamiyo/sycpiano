import '@/less/Media/media-content.less';
import '@/less/Media/Music/music.less';

import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { WaveformLoader, firLoader, constantQ, CONSTANTS } from '@/js/components/Media/Music/VisualizationUtils.js';
import { storeAnalyzers, updatePlaybackPosition, setIsPlaying, storeDuration } from '@/js/components/Media/Music/actions.js';
import Visualizer from '@/js/components/Media/Music/Visualizer.jsx';
import AudioInfo from '@/js/components/Media/Music/AudioInfo.jsx';

// const url = 'http://seanchenpiano.com/musicfiles/composing/improv.mp3';
const demo = {
    title: "Spellbound Concerto",
    composer: "Miklos Rosza",
    contributing: "New West Symphony",
    url: '/music/spellbound.mp3',
    waveform: '/music/waveforms/spellbound.dat'
};

class Music extends React.Component {
    togglePlaying = (event) => {
        if (event.keyCode == 32) {
            if (this.props.isPlaying) {
                this.audio.pause();
            } else {
                this.audio.play();
            }
            this.props.setIsPlaying(!this.props.isPlaying);
        }
    }

    initializeAudioPlayer = () => {
        this.el = ReactDOM.findDOMNode(this);
        this.audio = this.el.getElementsByTagName('audio')[0];
        this.audio.src = demo.url;
        this.waveformLoader = new WaveformLoader(demo.waveform);

        this.audio.addEventListener('loadeddata', this.audioOnLoad);
        this.audio.addEventListener('playing', this.onPlaying);
        this.audio.addEventListener('timeupdate', this.onTimeUpdate);
        this.audio.addEventListener('pause', this.onPause);
        this.audio.addEventListener('ended', this.onEnded);
    }

    onTimeUpdate = () => {
        this.props.updatePlaybackPosition(this.audio.currentTime, performance.now());
    }

    onEnded = () => {
        this.props.setIsPlaying(false);
        this.props.updatePlaybackPosition(0, performance.now());
        setTimeout(() => cancelAnimationFrame(this.props.animationRequestId), 500);
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

        this.analyserL.fftSize = this.analyserR.fftSize = CONSTANTS.FFT_SIZE;
        this.analyserL.smoothingTimeConstant = this.analyserR.smoothingTimeConstant = CONSTANTS.SMOOTHING_CONSTANT;

        this.props.storeAnalyzers([analyzerL, analyzerR]);
        this.props.storeDuration(this.audio.duration);

        this.audio.volume = 1;

        Promise.all([
            constantQ.loaded,
            firLoader.loaded,
            this.waveformLoader.loaded
        ]).then(() => {
            this.audio.play();
            this.props.setIsPlaying(true, demo);
        });

        window.audio = this.audio;
    }

    registerPlayingCallback = (func) => {
        this.playingCallback = func;
        this.audio.addEventListener('playing', this.playingCallback);
        //manually call func if audio already playing
        if (this.props.isPlaying) {
            func();
        }
    }

    onPause = () => {
        this.setIsPlaying(this.audio.currentTime, performance.now());
        setTimeout(() => cancelAnimationFrame(this.requestId), 500);
    }

    onPlaying = () => {
        this.setIsPlaying(this.audio.currentTime, performance.now());
        this.audioDuration = this.audio.duration;
        this.prevTimestamp = performance.now();
    }

    componentDidMount() {
        this.initializeAudioPlayer();

        window.addEventListener('keydown', this.togglePlaying);
    }

    render() {
        return (
            <div className="mediaContent music">
                <AudioInfo />
                <audio id="audio" crossOrigin="anonymous" />
                <Visualizer
                    waveformLoader={this.waveformLoader}
                    registerPlayingCallback={registerPlayingCallback}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isPlaying: state.audio_player.isPlaying,
    animationRequestId: state.audio_visualizer.animationRequestId
})

export default connect(
    mapStateToProps,
    {
        storeAnalyzers,
        updatePlaybackPosition,
        setIsPlaying,
        storeDuration
    }
)(Music);