import isEmpty from 'lodash-es/isEmpty';
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
import { getAudioContext } from 'src/components/Media/Music/utils';
import { constantQ, firLoader, waveformLoader } from 'src/components/Media/Music/VisualizationUtils';

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
    readonly onScroll: (event: React.UIEvent<HTMLElement> | UIEvent) => void;
}

interface MusicDispatchToProps {
    readonly fetchPlaylistAction: typeof fetchPlaylistAction;
    readonly setOnScroll: typeof setOnScroll;
}

interface MusicOwnProps {
    baseRoute: string;
    match: match<{
        composer?: string;
        piece?: string;
        movement?: string;
    }>;
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
    wasPlaying = false;
    audio: React.RefObject<HTMLAudioElement> = React.createRef();
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
        this.audio.current.play();
    }

    pause = () => {
        this.audio.current.pause();
    }

    onFirstUserInput = () => {
        this.setState({ userInput: true });
    }

    initializeAudioPlayer = async () => {
        const audioCtx = getAudioContext();
        const audioSrc = audioCtx.createMediaElementSource(this.audio.current);

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

        this.audio.current.volume = 0;

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
            const { composer, piece, movement } = this.props.match.params;
            const firstTrack = await this.props.fetchPlaylistAction(composer, piece, movement) as any;
            this.loadTrack(firstTrack);
        } catch (err) {
            console.error('playlist init failed.', err);
        }
    }

    loadTrack = async (track: MusicFileItem) => {
        if (this.state.currentTrack && this.state.currentTrack.musicFiles[0] &&
            this.state.currentTrack.musicFiles[0].id === track.id
        ) {
            return Promise.reject(new Error('no clicky'));
        }
        await new Promise((resolve) => {
            TweenLite.fromTo(this.audio.current, 0.3, { volume: this.audio.current.volume }, {
                volume: 0,
                onUpdate: () => {
                    this.setState({ volume: this.audio.current.volume });
                },
                onComplete: () => {
                    setTimeout(resolve, 100);
                },
            });
        });
        this.audio.current.pause();
        this.setState({
            currentTrack: {
                ...this.props.items.find((item) => {
                    return isMusicItem(item) && item.id === track.musicId;
                }),
                musicFiles: [track],
            } as MusicItem,
            duration: -1,
            isLoading: this.state.userInput ? true : false,
        });
        waveformLoader.loadWaveformFile(`${MUSIC_PATH}/waveforms/${track.waveformFile}`);
        this.audio.current.src = `${MUSIC_PATH}/${track.audioFile}`;
        await waveformLoader.loaded;
        TweenLite.fromTo(this.audio.current, 0.3, { volume: 0 }, {
            volume: 1,
            onUpdate: () => {
                if (this.audio.current) {
                    this.setState({ volume: this.audio.current.volume });
                }
            },
        });
    }

    onTimeUpdate = () => {
        this.setState({
            playbackPosition: this.audio.current.currentTime,
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
            this.loadTrack(next);
        }
    }

    onDrag = (percent: number) => {
        const position = percent * this.audio.current.duration;
        this.setState({
            playbackPosition: position,
            lastUpdateTimestamp: performance.now(),
        });
    }

    onStartDrag = (percent: number) => {
        this.wasPlaying = this.state.isPlaying;
        if (this.wasPlaying && !this.audio.current.paused) {
            this.audio.current.pause();
        }
        const position = percent * this.audio.current.duration;
        this.audio.current.currentTime = position;
    }

    seekAudio = (percent: number) => {
        this.onDrag(percent);
        const position = percent * this.audio.current.duration;
        this.audio.current.currentTime = position;
        if (this.wasPlaying && this.audio.current.paused) {
            this.audio.current.play();
        }
    }

    audioOnLoad = async () => {
        this.setState({
            duration: this.audio.current.duration,
            isLoading: false,
        });
        try {
            await Promise.all([constantQ.loaded, firLoader.loaded, waveformLoader.loaded]);
        } catch (err) {
            console.error('music component init failed.', err);
        }
    }

    onPause = () => {
        this.setState({
            isPlaying: false,
            playbackPosition: this.audio.current.currentTime,
            lastUpdateTimestamp: performance.now(),
        });
    }

    onPlaying = () => {
        this.setState({
            isPlaying: true,
            playbackPosition: this.audio.current.currentTime,
            lastUpdateTimestamp: performance.now(),
        });
    }

    componentDidMount() {
        this.props.setOnScroll(navBarHeight.mobile);
        this.initializeAudioPlayer();
    }

    async componentWillUnmount() {
        this.audio.current.pause();
        waveformLoader.reset();
    }

    render() {
        const isMobile = this.props.isMobile;
        return (
            <div className={musicStyle} onScroll={this.props.isMobile ? this.props.onScroll : null}>
                <audio
                    id="audio"
                    crossOrigin="anonymous"
                    ref={this.audio}
                    onLoadedData={this.audioOnLoad}
                    onCanPlayThrough={this.audioOnLoad}
                    onPlaying={this.onPlaying}
                    onTimeUpdate={this.onTimeUpdate}
                    onPause={this.onPause}
                    onEnded={this.onEnded}
                />
                <MusicPlaylist
                    play={this.play}
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
                    matchParams={!isEmpty(this.props.match.params)}
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
