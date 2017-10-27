import '@/less/Media/media-content.less';
import '@/less/Media/Music/music.less';

import React from 'react';
import { connect } from 'react-redux';
import { WaveformLoader, firLoader, constantQ } from '@/js/components/Media/Music/VisualizationUtils.js';
import { TweenLite } from 'gsap';
import {
    fetchPlaylistAction,
    selectTrack,
    storeWaveformLoader,
    storeAnalyzers,
    updatePlaybackPosition,
    setIsPlaying,
    storeDuration, } from '@/js/components/Media/Music/actions.js';
import AudioVisualizer from '@/js/components/Media/Music/AudioVisualizer.jsx';
import AudioInfo from '@/js/components/Media/Music/AudioInfo.jsx';
import AudioUI from '@/js/components/Media/Music/AudioUI.jsx';
import MusicPlaylist from '@/js/components/Media/Music/MusicPlaylist.jsx';

class Music extends React.Component {
    autoPlay = false;
    wasPlaying = false;

    play = () => {
        this.audio.play();
    }
    pause = () => {
        this.audio.pause();
    }

    initializeAudioPlayer = async () => {
        this.audio.addEventListener('loadeddata', this.audioOnLoad);
        this.audio.addEventListener('playing', this.onPlaying);
        this.audio.addEventListener('timeupdate', this.onTimeUpdate);
        this.audio.addEventListener('pause', this.onPause);
        this.audio.addEventListener('ended', this.onEnded);

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

        this.audio.volume = 1;
        window.audio = this.audio;

        const firstTrack = await this.props.fetchPlaylistAction();
        this.loadTrack(firstTrack, false);
    }

    loadTrack = (track, autoPlay) => {
        TweenLite.fromTo(this.audio, 0.5, { volume: 1 }, { volume: 0, ease: "Power3.easeIn",
            onComplete: () => {
                setTimeout(() => {
                    this.audio.pause();
                    this.waveformLoader = new WaveformLoader(track.waveform);
                    this.props.storeWaveformLoader(this.waveformLoader);
                    this.props.selectTrack(track);
                    this.autoPlay = autoPlay;
                    this.audio.volume = 1;
                    this.audio.src = track.url;
                }, 100);
            }
        });
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
        const position = percent * this.audio.duration;
        this.audio.currentTime = position;
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

    audioOnLoad = async () => {
        this.props.storeDuration(this.audio.duration);

        try {
            await Promise.all([
                constantQ.loaded,
                firLoader.loaded,
                this.waveformLoader.loaded
            ]);

            this.analyzerL.fftSize = this.analyzerR.fftSize = constantQ.numRows * 2;
            this.props.storeAnalyzers([this.analyzerL, this.analyzerR]);
            this.animationCallback();
            if (this.autoPlay) {
                this.props.setIsPlaying(true);
                this.audio.play();
            }
        } catch (err) {
            console.error('music component init failed.', err);
        }
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
    }

    render() {
        return (
            <div className="mediaContent music">
                <audio id="audio" crossOrigin="anonymous" ref={(audio) => this.audio = audio} />
                <MusicPlaylist onClick={this.loadTrack}/>
                <AudioUI
                    seekAudio={this.seekAudio}
                    onStartDrag={this.onStartDrag}
                    onDrag={this.onDrag}
                    play={this.play}
                    pause={this.pause}
                />
                <AudioInfo />
                <AudioVisualizer
                    registerAnimationCallback={this.registerAnimationCallback}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isPlaying: state.audio_player.isPlaying,
    animationRequestId: state.audio_visualizer.animationRequestId,
    currentTrack: state.audio_player.currentTrack,
})

export default connect(
    mapStateToProps,
    {
        fetchPlaylistAction,
        selectTrack,
        storeWaveformLoader,
        storeAnalyzers,
        updatePlaybackPosition,
        setIsPlaying,
        storeDuration,
    }
)(Music);