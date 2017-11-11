import '@/less/Media/media-content.less';
import '@/less/Media/Music/music.less';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { waveformLoader, firLoader, constantQ } from '@/js/components/Media/Music/VisualizationUtils.js';
import { TweenLite } from 'gsap';
import { fetchPlaylistAction } from '@/js/components/Media/Music/actions.js';
import AudioVisualizer from '@/js/components/Media/Music/AudioVisualizer.jsx';
import AudioInfo from '@/js/components/Media/Music/AudioInfo.jsx';
import AudioUI from '@/js/components/Media/Music/AudioUI.jsx';
import MusicPlaylist from '@/js/components/Media/Music/MusicPlaylist.jsx';

class Music extends React.Component {
    autoPlay = false;
    wasPlaying = false;
    loaded = false;
    state = {
        analyzers: [null, null],
        isPlaying: false,
        volume: 0.0,
        playbackPosition: 0.0,
        lastUpdateTimestamp: 0,
        duration: -1,
        track: null,
        currentTrack: {},
    }

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
        const splitter = audioCtx.createChannelSplitter(2);
        const merger = audioCtx.createChannelMerger(2);
        audioSrc.connect(splitter);
        splitter.connect(this.analyzerL, 0);
        splitter.connect(this.analyzerR, 1);
        this.analyzerL.connect(merger, 0, 0);
        this.analyzerR.connect(merger, 0, 1);
        merger.connect(audioCtx.destination);

        this.analyzerL.smoothingTimeConstant = this.analyzerR.smoothingTimeConstant = 0.9 * Math.pow(audioCtx.sampleRate / 192000, 2);

        this.audio.volume = 0;

        this.waitForConstantQ();
        this.waitForPlaylist();
    }

    waitForConstantQ = async () => {
        try {
            await constantQ.loaded;
            this.analyzerL.fftSize = this.analyzerR.fftSize = constantQ.numRows * 2;
            this.setState({ analyzers: [this.analyzerL, this.analyzerR] });
        } catch (err) {
            console.error('constantQ init failed.', err);
        }
    }

    waitForPlaylist = async () => {
        try {
            const firstTrack = await this.props.fetchPlaylistAction(this.props.match.params.track);
            this.loadTrack(firstTrack, false);
        }
        catch (err) {
            console.error('playlist init failed.', err);
        }
    }

    loadTrack = async (track, autoPlay) => {
        this.loaded = false;
        this.autoPlay = autoPlay;
        await new Promise((resolve) => {
            TweenLite.fromTo(this.audio, 0.3, { volume: this.audio.volume }, {
                volume: 0,
                onUpdate: () => {
                    this.setState({ volume: this.audio.volume });
                },
                onComplete: () => {
                    setTimeout(resolve, 100);
                }
            });
        });
        this.audio.pause();
        this.setState({ currentTrack: track, duration: -1 });
        waveformLoader.loadWaveformFile(track.waveform);
        this.audio.src = track.url;
        await waveformLoader.loaded;
        TweenLite.fromTo(this.audio, 0.3, { volume: 0 }, {
            volume: 1,
            onUpdate: () => {
                this.setState({ volume: this.audio.volume });
            },
        });
    }

    onTimeUpdate = () => {
        this.setState({
            playbackPosition: this.audio.currentTime,
            lastUpdateTimestamp: performance.now()
        });
    }

    onEnded = () => {
        this.setState({
            isPlaying: false,
            playbackPosition: 0,
            lastUpdateTimestamp: performance.now()
        });
    }

    onDrag = (percent) => {
        const position = percent * this.audio.duration;
        this.setState({
            playbackPosition: position,
            lastUpdateTimestamp: performance.now()
        });
    }

    onStartDrag = (percent) => {
        this.wasPlaying = this.state.isPlaying;
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
        this.setState({ duration: this.audio.duration });
        this.loaded = true;
        try {
            await Promise.all([constantQ.loaded, firLoader.loaded, waveformLoader.loaded]);
            if (this.autoPlay) {
                this.setState({ isPlaying: true });
                this.audio.play();
            }
        } catch (err) {
            console.error('music component init failed.', err);
        }
    }

    onPause = () => {
        this.setState({
            isPlaying: false,
            playbackPosition: this.audio.currentTime,
            lastUpdateTimestamp: performance.now(),
        });
    }

    onPlaying = () => {
        this.setState({
            isPlaying: true,
            playbackPosition: this.audio.currentTime,
            lastUpdateTimestamp: performance.now(),
        });
    }

    componentDidMount() {
        this.initializeAudioPlayer();
    }

    componentWillUnmount() {
        this.audio.removeEventListener('loadeddata', this.audioOnLoad);
        this.audio.removeEventListener('playing', this.onPlaying);
        this.audio.removeEventListener('timeupdate', this.onTimeUpdate);
        this.audio.removeEventListener('pause', this.onPause);
        this.audio.removeEventListener('ended', this.onEnded);
        this.audio.pause();
        waveformLoader.reset();
    }

    render() {
        return (
            <div className="mediaContent music">
                <audio id="audio" crossOrigin="anonymous" ref={(audio) => this.audio = audio} />
                <MusicPlaylist
                    onClick={this.loadTrack}
                    currentTrack={this.state.currentTrack}
                    baseRoute={this.props.baseRoute}
                />
                <AudioUI
                    seekAudio={this.seekAudio}
                    onStartDrag={this.onStartDrag}
                    onDrag={this.onDrag}
                    volume={this.state.volume}
                    play={this.play}
                    pause={this.pause}
                    isPlaying={this.state.isPlaying}
                    currentPosition={this.state.playbackPosition}
                />
                <AudioInfo
                    duration={this.state.duration}
                    currentTrack={this.state.currentTrack}
                />
                <AudioVisualizer
                    currentPosition={this.state.playbackPosition}
                    analyzers={this.state.analyzers}
                    isPlaying={this.state.isPlaying}
                    duration={this.state.duration}
                    prevTimestamp={this.state.lastUpdateTimestamp}
                    volume={this.state.volume}
                />
            </div>
        );
    }
}

Music.propTypes = {
    baseRoute: PropTypes.String.isRequired,
    fetchPlaylistAction: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired
}

export default connect(
    null,
    {
        fetchPlaylistAction
    }
)(Music);