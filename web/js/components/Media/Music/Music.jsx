import '@/less/Media/media-content.less';
import '@/less/Media/Music/music.less';

import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { WaveformLoader, firLoader, constantQ } from '@/js/components/Media/Music/VisualizationUtils.js';
import { storeWaveformLoader, storeAnalyzers, updatePlaybackPosition, setIsPlaying, storeDuration } from '@/js/components/Media/Music/actions.js';
import AudioVisualizer from '@/js/components/Media/Music/AudioVisualizer.jsx';
import AudioInfo from '@/js/components/Media/Music/AudioInfo.jsx';
import AudioUI from '@/js/components/Media/Music/AudioUI.jsx';

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
        if (event.keyCode === 32) {
            if (this.props.isPlaying) {
                this.audio.pause();
            } else {
                this.audio.play();
            }
        }
    }

    initializeAudioPlayer = () => {
        this.el = ReactDOM.findDOMNode(this);
        this.audio = this.el.getElementsByTagName('audio')[0];
        this.audio.src = demo.url;
        this.waveformLoader = new WaveformLoader(demo.waveform);
        this.props.storeWaveformLoader(this.waveformLoader);

        this.audio.addEventListener('loadeddata', this.audioOnLoad);
        this.audio.addEventListener('playing', this.onPlaying);
        this.audio.addEventListener('timeupdate', this.onTimeUpdate);
        this.audio.addEventListener('pause', this.onPause);
        this.audio.addEventListener('ended', this.onEnded);

        this.wasPlaying = false;
    }

    onTimeUpdate = () => {
        this.props.updatePlaybackPosition(this.audio.currentTime, performance.now());
    }

    onEnded = () => {
        this.props.setIsPlaying(false);
        this.props.updatePlaybackPosition(0, performance.now());
    }

    onDrag = (percent) => {
        const position = percent * this.audio.duration;
        this.props.updatePlaybackPosition(position, performance.now());
    }

    onStartDrag = (percent) => {
        this.wasPlaying = this.props.isPlaying;
        this.audio.pause();
        this.onDrag(percent);
    }

    seekAudio = (percent) => {
        this.onDrag(percent);
        const position = percent * this.audio.duration;
        this.audio.currentTime = position;
        if (this.wasPlaying) {
            this.audio.play();
        }
    }

    audioOnLoad = () => {
        // split src into channels to analyze separately, then merge back to destination
        const audioCtx = new AudioContext();
        const audioSrc = audioCtx.createMediaElementSource(this.audio);
        this.analyzerL = audioCtx.createAnalyser();
        this.analyzerR = audioCtx.createAnalyser();
        this.splitter = audioCtx.createChannelSplitter(2);
        this.merger = audioCtx.createChannelMerger(2);
        audioSrc.connect(this.splitter);
        this.splitter.connect(this.analyzerL, 0);
        this.splitter.connect(this.analyzerR, 1);
        this.analyzerL.connect(this.merger, 0, 0);
        this.analyzerR.connect(this.merger, 0, 1);
        this.merger.connect(audioCtx.destination);

        this.analyzerL.smoothingTimeConstant = this.analyzerR.smoothingTimeConstant = 0.9 * Math.pow(audioCtx.sampleRate / 192000, 2);
        this.props.storeDuration(this.audio.duration);

        this.audio.volume = 1;

        Promise.all([
            constantQ.loaded,
            firLoader.loaded,
            this.waveformLoader.loaded
        ]).then(() => {
            this.analyzerL.fftSize = this.analyzerR.fftSize = constantQ.numRows * 2;
            this.props.storeAnalyzers([this.analyzerL, this.analyzerR]);
            this.props.setIsPlaying(false, demo);
            this.animationCallback();
        });

        window.audio = this.audio;
    }

    registerAnimationCallback = (func) => {
        this.animationCallback = func;
        // manually call func if audio already playing
        if (this.props.isPlaying) {
            this.animationCallback();
        }
    }

    onPause = () => {
        this.props.setIsPlaying(false);
        this.props.updatePlaybackPosition(this.audio.currentTime, performance.now());
    }

    onPlaying = () => {
        this.props.setIsPlaying(true);
        this.props.updatePlaybackPosition(this.audio.currentTime, performance.now());
    }

    componentDidMount() {
        this.initializeAudioPlayer();
        window.addEventListener('keydown', this.togglePlaying);
    }

    render() {
        return (
            <div className="mediaContent music">
                <AudioUI
                    seekAudio={this.seekAudio}
                    onStartDrag={this.onStartDrag}
                    onDrag={this.onDrag}
                />
                <AudioInfo />
                <audio id="audio" crossOrigin="anonymous" />
                <AudioVisualizer
                    registerAnimationCallback={this.registerAnimationCallback}
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
        storeWaveformLoader,
        storeAnalyzers,
        updatePlaybackPosition,
        setIsPlaying,
        storeDuration,
    }
)(Music);