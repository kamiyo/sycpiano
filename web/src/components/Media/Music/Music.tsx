import * as React from 'react';
import { css } from 'react-emotion';
import { connect } from 'react-redux';
import { match } from 'react-router';

import TweenLite from 'gsap/TweenLite';

import { setOnScroll } from 'src/components/App/NavBar/actions';
import { fetchPlaylistAction } from 'src/components/Media/Music/actions';
import AudioInfo from 'src/components/Media/Music/AudioInfo';
import AudioUI from 'src/components/Media/Music/AudioUI';
import AudioVisualizer from 'src/components/Media/Music/AudioVisualizer';
import MusicPlaylist from 'src/components/Media/Music/MusicPlaylist';
import { constantQ, firLoader, waveformLoader } from 'src/components/Media/Music/VisualizationUtils';
import { getAudioContext } from 'src/utils';

import { isMusicItem, MusicFileItem, MusicItem, MusicListItem } from 'src/components/Media/Music/types';
import { GlobalStateShape } from 'src/types';

import { pushed } from 'src/styles/mixins';
import { screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';

interface MusicState {
    readonly isPlaying: boolean;
    readonly userInput: boolean;
    readonly volume: number;
    readonly playbackPosition: number;
    readonly lastUpdateTimestamp: number;
    readonly duration: number;
    readonly currentTrack: MusicItem;
    readonly isLoading: boolean;
}

interface MusicStateToProps {
    readonly items: MusicListItem[];
    readonly onScroll: (event: React.SyntheticEvent<HTMLElement>) => void;
}

interface MusicDispatchToProps {
    readonly fetchPlaylistAction: typeof fetchPlaylistAction;
    readonly setOnScroll: typeof setOnScroll;
}

interface MusicOwnProps {
    baseRoute: string;
    match: match<any>;
    isMobile: boolean;
}

type MusicProps = MusicOwnProps & MusicStateToProps & MusicDispatchToProps;

const musicStyle = css`
    ${pushed}
    position: relative;
    width: 100%;
    background-color: black;

    ${/* sc-selector */ screenXSorPortrait} {
        margin-top: 0;
        padding-top: ${navBarHeight.mobile}px;
        height: 100%;
        overflow-y: scroll;
    }
`;

class Music extends React.Component<MusicProps, MusicState> {
    autoPlay = false;
    wasPlaying = false;
    loaded = false;
    audio: HTMLAudioElement;
    state: MusicState = {
        isPlaying: false,
        userInput: false,
        volume: 0.0,
        playbackPosition: 0.0,
        lastUpdateTimestamp: 0,
        duration: -1,
        currentTrack: undefined,
        isLoading: false,
    };

    analyzerL: AnalyserNode;
    analyzerR: AnalyserNode;

    getNextMovement = () => {
        const curr = this.props.items.find((item) => isMusicItem(item) && item.id === this.state.currentTrack.id) as MusicItem;
        const trackNo = curr.musicFiles.findIndex((file) => file.id === this.state.currentTrack.musicFiles[0].id);
        const nextTrackNo = trackNo + 1;
        return (nextTrackNo < curr.musicFiles.length) ? curr.musicFiles[nextTrackNo] : null;
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

    onFirstUserInput = () => {
        this.setState({ userInput: true });
    }

    initializeAudioPlayer = async () => {
        this.audio.addEventListener('loadeddata', this.audioOnLoad);
        this.audio.addEventListener('playing', this.onPlaying);
        this.audio.addEventListener('timeupdate', this.onTimeUpdate);
        this.audio.addEventListener('pause', this.onPause);
        this.audio.addEventListener('ended', this.onEnded);

        const audioCtx = getAudioContext();
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

        this.setState({ isLoading: true });
        this.waitForConstantQ();
        this.waitForPlaylist();
        this.setState({ isLoading: false });
    }

    waitForConstantQ = async () => {
        try {
            await constantQ.loaded;
            this.analyzerL.fftSize = this.analyzerR.fftSize = constantQ.numRows * 2;
        } catch (err) {
            console.error('constantQ init failed.', err);
        }
    }

    waitForPlaylist = async () => {
        try {
            const firstTrack = await this.props.fetchPlaylistAction(this.props.match.params.track) as any;
            this.loadTrack(firstTrack, false);
        } catch (err) {
            console.error('playlist init failed.', err);
        }
    }

    loadTrack = async (track: MusicFileItem, autoPlay: boolean) => {
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
                },
            });
        });
        this.audio.pause();
        this.setState({
            currentTrack: {
                ...this.props.items.find((item) => {
                    return isMusicItem(item) && item.id === track.musicId;
                }),
                musicFiles: [track],
            } as MusicItem,
            duration: -1,
            isLoading: true,
        });
        waveformLoader.loadWaveformFile(`${MUSIC_PATH}/waveforms/${track.waveformFile}`);
        this.audio.src = `${MUSIC_PATH}/${track.audioFile}`;
        await waveformLoader.loaded;
        this.setState({
            isLoading: false,
        });
        TweenLite.fromTo(this.audio, 0.3, { volume: 0 }, {
            volume: 1,
            onUpdate: () => {
                if (this.audio) {
                    this.setState({ volume: this.audio.volume });
                }
            },
        });
    }

    onTimeUpdate = () => {
        this.setState({
            playbackPosition: this.audio.currentTime,
            lastUpdateTimestamp: performance.now(),
        });
    }

    onEnded = () => {
        this.setState({
            isPlaying: false,
            playbackPosition: 0,
            lastUpdateTimestamp: performance.now(),
        });
        const next = this.getNextMovement();
        if (next) {
            this.loadTrack(next, true);
        }
    }

    onDrag = (percent: number) => {
        const position = percent * this.audio.duration;
        this.setState({
            playbackPosition: position,
            lastUpdateTimestamp: performance.now(),
        });
    }

    onStartDrag = (percent: number) => {
        this.wasPlaying = this.state.isPlaying;
        const position = percent * this.audio.duration;
        this.audio.currentTime = position;
        this.audio.pause();
        this.onDrag(percent);
    }

    seekAudio = (percent: number) => {
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
        this.props.setOnScroll(navBarHeight.mobile);
        this.initializeAudioPlayer();
    }

    async componentWillUnmount() {
        this.audio.removeEventListener('loadeddata', this.audioOnLoad);
        this.audio.removeEventListener('playing', this.onPlaying);
        this.audio.removeEventListener('timeupdate', this.onTimeUpdate);
        this.audio.removeEventListener('pause', this.onPause);
        this.audio.removeEventListener('ended', this.onEnded);
        this.audio.pause();
        waveformLoader.reset();
    }

    render() {
        const isMobile = this.props.isMobile;
        return (
            <div className={musicStyle} onScroll={isMobile ? this.props.onScroll : null}>
                <audio id="audio" crossOrigin="anonymous" ref={(audio) => this.audio = audio} />
                <MusicPlaylist
                    audio={this.audio}
                    onClick={this.loadTrack}
                    currentTrackId={(this.state.currentTrack) ? this.state.currentTrack.musicFiles[0].id : ''}
                    baseRoute={this.props.baseRoute}
                    userInput={this.state.userInput}
                    onFirstUserInput={this.onFirstUserInput}
                    isMobile={isMobile}
                />
                <AudioUI
                    seekAudio={this.seekAudio}
                    onStartDrag={this.onStartDrag}
                    onDrag={this.onDrag}
                    play={this.play}
                    pause={this.pause}
                    isPlaying={this.state.isPlaying}
                    currentPosition={this.state.playbackPosition}
                    userInput={this.state.userInput}
                    onFirstUserInput={this.onFirstUserInput}
                    isMobile={isMobile}
                    isLoading={this.state.isLoading}
                />
                <AudioInfo
                    duration={this.state.duration}
                    currentPosition={this.state.playbackPosition}
                    currentTrack={this.state.currentTrack}
                    isMobile={isMobile}
                />
                <AudioVisualizer
                    currentPosition={this.state.playbackPosition}
                    analyzers={[this.analyzerL, this.analyzerR]}
                    isPlaying={this.state.isPlaying}
                    duration={this.state.duration}
                    prevTimestamp={this.state.lastUpdateTimestamp}
                    volume={this.state.volume}
                    isMobile={isMobile}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: GlobalStateShape): MusicStateToProps => ({
    items: state.audio_playlist.items,
    onScroll: state.navbar.onScroll,
});

const ConnectedMusic = connect<MusicStateToProps, MusicDispatchToProps>(
    mapStateToProps,
    {
        fetchPlaylistAction,
        setOnScroll,
    },
)(Music);

export type MusicType = typeof ConnectedMusic;
export default ConnectedMusic;
