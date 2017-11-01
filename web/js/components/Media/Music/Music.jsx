import '@/less/Media/media-content.less';
import '@/less/Media/Music/music.less';

import React from 'react';
import { connect } from 'react-redux';
import { waveformLoader, firLoader, constantQ } from '@/js/components/Media/Music/VisualizationUtils.js';
import { TweenLite } from 'gsap';
import {
    fetchPlaylistAction,
    selectTrack,
    storeAnalyzers,
    updatePlaybackPosition,
    setIsPlaying,
    storeDuration,
    storeVolume,
} from '@/js/components/Media/Music/actions.js';
import AudioVisualizer from '@/js/components/Media/Music/AudioVisualizer.jsx';
import AudioInfo from '@/js/components/Media/Music/AudioInfo.jsx';
import AudioUI from '@/js/components/Media/Music/AudioUI.jsx';
import MusicPlaylist from '@/js/components/Media/Music/MusicPlaylist.jsx';

class Music extends React.Component {
    autoPlay = false;
    wasPlaying = false;
    loaded = false;

    play = () => {
        if (!this.loaded) {
            this.autoPlay = false;
        }
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

        window.audio = this.audio;

        waitForConstantQ();
        waitForPlaylist();
    }

    waitForConstantQ = async () => {
        try {
            await constantQ.loaded;
            this.analyzerL.fftSize = this.analyzerR.fftSize = constantQ.numRows * 2;
            this.props.storeAnalyzers([this.analyzerL, this.analyzerR]);
        } catch (err) {
            console.error('constantQ init failed.', err);
        }
    }

    waitForPlaylist = async () => {
        try {
            const firstTrack = await this.props.fetchPlaylistAction();
            this.loadTrack(firstTrack, false);
        }
        catch (err) {
            console.error('playlist init failed.', err);
        }
    }

    loadTrack = async (track, autoPlay) => {
        this.autoPlay = autoPlay;
        await new Promise((resolve, reject) => {
            TweenLite.fromTo(this.audio, 0.3, { volume: 1 }, {
                volume: 0,
                onUpdate: () => {
                    this.props.storeVolume(this.audio.volume);
                },
                onComplete: () => {
                    setTimeout(resolve, 100);
                }
            });
        });
        this.audio.pause();
        this.props.selectTrack(track);
        waveformLoader.loadWaveformFile(track.waveform);
        this.loaded = false;
        this.audio.src = track.url;
        await waveformLoader.loaded;
        TweenLite.fromTo(this.audio, 0.3, { volume: 0 }, {
            volume: 1,
            onUpdate: () => {
                this.props.storeVolume(this.audio.volume);
            },
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
        this.loaded = true;
        try {
            await Promise.all([constantQ.loaded, firLoader.loaded, waveformLoader.loaded]);
            if (this.autoPlay) {
                this.props.setIsPlaying(true);
                this.audio.play();
            }
        } catch (err) {
            console.error('music component init failed.', err);
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
                <MusicPlaylist onClick={this.loadTrack} />
                <AudioUI
                    seekAudio={this.seekAudio}
                    onStartDrag={this.onStartDrag}
                    onDrag={this.onDrag}
                    volume={this.volume}
                    play={this.play}
                    pause={this.pause}
                />
                <AudioInfo />
                <AudioVisualizer />
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
        storeAnalyzers,
        updatePlaybackPosition,
        setIsPlaying,
        storeDuration,
        storeVolume,
    }
)(Music);