/* global MUSIC_PATH */

import isEmpty from 'lodash-es/isEmpty';
import shuffle from 'lodash-es/shuffle';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import styled from '@emotion/styled';

import { TweenLite } from 'gsap';

import { onScroll, scrollFn } from 'src/components/App/NavBar/actions';
import { fetchPlaylistAction } from 'src/components/Media/Music/actions';
import AudioInfo from 'src/components/Media/Music/AudioInfo';
import AudioUI from 'src/components/Media/Music/AudioUI';
import MusicPlaylist from 'src/components/Media/Music/MusicPlaylist';
import { getAudioContext, getPermaLink, modulo } from 'src/components/Media/Music/utils';
import { constantQ, firLoader, waveformLoader } from 'src/components/Media/Music/VisualizationUtils';

import { AudioVisualizerType } from 'src/components/Media/Music/audioVisualizerBase';
import { MusicFileItem, MusicListItem } from 'src/components/Media/Music/types';
import { GlobalStateShape } from 'src/types';

import { pushed } from 'src/styles/mixins';
import { screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';

import module from 'src/module';
import store from 'src/store';

const register = module(store);

interface MusicState {
    readonly isPlaying: boolean;
    readonly volume: number;
    readonly playbackPosition: number;
    readonly lastUpdateTimestamp: number;
    readonly duration: number;
    readonly currentTrack: MusicFileItem;
    readonly isLoading: boolean;
    readonly userInteracted: boolean;
    readonly isShuffle: boolean;
    readonly localFlat: MusicFileItem[];

    readonly Visualizer: AudioVisualizerType;
    readonly isHoverSeekring: boolean;
    readonly isMouseMove: boolean;
    readonly angle: number;
    readonly radii: {
        readonly inner: number;
        readonly outer: number;
        readonly base: number;
    };
}

interface MusicStateToProps {
    readonly items: MusicListItem[];
    readonly flatItems: MusicFileItem[];
}

interface MusicDispatchToProps {
    readonly fetchPlaylistAction: (composer: string, piece: string, movement?: string) => Promise<MusicFileItem>;
    readonly onScroll: (triggerHeight: number, scrollTop: number) => void;
}

interface MusicOwnProps {
    baseRoute: string;
    isMobile: boolean;
}

type MusicProps = MusicOwnProps & MusicStateToProps & MusicDispatchToProps & RouteComponentProps<{
    composer?: string;
    piece?: string;
    movement?: string;
}>;

const MusicDiv = styled.div`
    ${pushed}
    position: relative;
    width: 100%;
    background-color: black;

    ${screenXSorPortrait} {
        margin-top: 0;
        padding-top: ${navBarHeight.mobile}px;
        height: 100%;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
    }
`;

class Music extends React.Component<MusicProps, MusicState> {
    wasPlaying = false;
    audio: React.RefObject<HTMLAudioElement> = React.createRef();
    state: MusicState = {
        isPlaying: false,
        volume: 0.0,
        playbackPosition: 0.0,
        lastUpdateTimestamp: 0,
        duration: -1,
        currentTrack: undefined,
        isLoading: false,
        userInteracted: false,
        isShuffle: false,
        localFlat: [],
        Visualizer: null,
        isHoverSeekring: false,
        isMouseMove: false,
        angle: 0,
        radii: {
            inner: 0,
            outer: 0,
            base: 0,
        },
    };

    audioCtx: AudioContext;
    analyzerL: AnalyserNode;
    analyzerR: AnalyserNode;

    musicOrder: number[];
    musicFileOrder: number[];

    getNextTrack = (which: 'next' | 'prev', force = false) => {
        const trackNo = this.state.localFlat.findIndex((item) => item.id === this.state.currentTrack.id);
        const nextTrackNo = (which === 'next') ? trackNo + 1 : trackNo - 1;
        if (force) {
            return this.state.localFlat[modulo(nextTrackNo, this.state.localFlat.length)];
        }
        if (nextTrackNo >= 0 && nextTrackNo < this.state.localFlat.length
        ) {
            return this.state.localFlat[nextTrackNo];
        }
    }

    toggleShuffle = () => {
        this.setState({
            isShuffle: !this.state.isShuffle,
        }, () => {
            if (this.state.isShuffle) {
                this.setState({
                    localFlat: shuffle(this.state.localFlat),
                });
            } else {
                this.setState({
                    localFlat: this.props.flatItems,
                });
            }
        });
    }

    play = () => {
        if (!this.state.userInteracted) {
            this.setState({
                userInteracted: true,
            });
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
        this.audio.current.play();
    }

    pause = () => {
        this.audio.current.pause();
    }

    initializeAudioPlayer = async () => {
        this.audioCtx = getAudioContext();
        const audioSrc = this.audioCtx.createMediaElementSource(this.audio.current);

        // source -> split(L, R) => analyzer(L, R) => merge -> dest
        this.analyzerL = this.audioCtx.createAnalyser();
        this.analyzerR = this.audioCtx.createAnalyser();

        const splitter = this.audioCtx.createChannelSplitter(2);
        const merger = this.audioCtx.createChannelMerger(2);
        audioSrc.connect(splitter);
        splitter.connect(this.analyzerL, 0);
        splitter.connect(this.analyzerR, 1);
        this.analyzerL.connect(merger, 0, 0);
        this.analyzerR.connect(merger, 0, 1);
        merger.connect(this.audioCtx.destination);

        const sampleRate = this.audioCtx.sampleRate;
        // smooth more when sampleRate is higher
        this.analyzerL.smoothingTimeConstant = this.analyzerR.smoothingTimeConstant = 0.9 * Math.pow(sampleRate / 192000, 2);

        this.audio.current.volume = 0;

        this.setState({ isLoading: true });
        this.waitForFilterAndPlaylist();
    }

    waitForFilterAndPlaylist = async () => {
        try {
            const { composer, piece, movement } = this.props.match.params;

            const [, firstTrack] = await Promise.all([
                constantQ.loaded,
                this.props.fetchPlaylistAction(composer, piece, movement),
            ]);

            this.analyzerL.fftSize = this.analyzerR.fftSize = constantQ.numRows * 2;

            this.setState({
                localFlat: this.props.flatItems,
            });
            this.loadTrack(firstTrack);
        } catch (err) {
            console.error('constantQ or playlist init failed.', err);
        }
    }

    loadTrack = async (track: MusicFileItem) => {
        if (this.state.currentTrack && this.state.currentTrack.id === track.id
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
            currentTrack: track,
            duration: -1,
            isLoading: this.audioCtx.state === 'suspended' ? false : true,
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

    playPrev = async () => {
        if (!this.state.userInteracted) {
            this.play();
        }
        const next = this.getNextTrack('prev', true);
        if (next) {
            this.props.history.push(getPermaLink(this.props.baseRoute, next.musicItem.composer, next.musicItem.piece, next.name));
            await this.loadTrack(next);
            this.play();
        }
    }

    playNext = async () => {
        if (!this.state.userInteracted) {
            this.play();
        }
        const next = this.getNextTrack('next', true);
        if (next) {
            this.props.history.push(getPermaLink(this.props.baseRoute, next.musicItem.composer, next.musicItem.piece, next.name));
            await this.loadTrack(next);
            this.play();
        }
    }

    onEnded = () => {
        this.setState({
            isPlaying: false,
            playbackPosition: 0,
            lastUpdateTimestamp: performance.now(),
        });
        this.playNext();
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

    detectWebGL = () => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return (gl && gl instanceof WebGLRenderingContext);
    }

    setHoverSeekring = (isHoverSeekring: boolean, angle: number) => {
        this.setState({
            isHoverSeekring,
            angle,
        });
    }

    setMouseMove = (isMouseMove: boolean) => {
        this.setState({ isMouseMove });
    }

    setRadii = (inner: number, outer: number, base: number) => {
        this.setState({
            radii: {
                inner,
                outer,
                base,
            },
        });
    }

    async componentDidMount() {
        this.initializeAudioPlayer();
        if (this.detectWebGL()) {
            const component = await register('visualizer', import(/* webpackChunkName: 'visualizerWebGL' */ 'src/components/Media/Music/AudioVisualizerWebGL'));
            this.setState({
                Visualizer: component.Component as AudioVisualizerType,
            });
        } else {
            const component = await register('visualizer', import(/* webpackChunkName: 'visualizerCanvas' */ 'src/components/Media/Music/AudioVisualizerCanvas'));
            this.setState({
                Visualizer: component.Component as AudioVisualizerType,
            });
        }
    }

    async componentWillUnmount() {
        this.audio.current.pause();
        waveformLoader.reset();
    }

    render() {
        const isMobile = this.props.isMobile;
        const Visualizer = this.state.Visualizer;
        return (
            <MusicDiv onScroll={this.props.isMobile ? scrollFn(navBarHeight.mobile, this.props.onScroll) : null}>
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
                    currentTrackId={(this.state.currentTrack) ? this.state.currentTrack.id : ''}
                    baseRoute={this.props.baseRoute}
                    isMobile={isMobile}
                    userInteracted={this.state.userInteracted}
                    toggleShuffle={this.toggleShuffle}
                    isShuffle={this.state.isShuffle}
                />
                <AudioUI
                    seekAudio={this.seekAudio}
                    onStartDrag={this.onStartDrag}
                    onDrag={this.onDrag}
                    play={this.play}
                    pause={this.pause}
                    next={this.playNext}
                    prev={this.playPrev}
                    isPlaying={this.state.isPlaying}
                    currentPosition={this.state.playbackPosition}
                    isMobile={isMobile}
                    isLoading={this.state.isLoading}
                    isMouseMove={this.state.isMouseMove}
                    radii={this.state.radii}
                    setMouseMove={this.setMouseMove}
                    setRadii={this.setRadii}
                    setHoverSeekring={this.setHoverSeekring}
                />
                <AudioInfo
                    duration={this.state.duration}
                    currentPosition={this.state.playbackPosition}
                    currentTrack={this.state.currentTrack}
                    isMobile={isMobile}
                    matchParams={!isEmpty(this.props.match.params)}
                />
                {Visualizer && (
                    <Visualizer
                        currentPosition={this.state.playbackPosition}
                        analyzers={[this.analyzerL, this.analyzerR]}
                        isPlaying={this.state.isPlaying}
                        duration={this.state.duration}
                        prevTimestamp={this.state.lastUpdateTimestamp}
                        volume={this.state.volume}
                        isMobile={isMobile}
                        isHoverSeekring={this.state.isHoverSeekring}
                        hoverAngle={this.state.angle}
                        setRadii={this.setRadii}
                    />
                )}
            </MusicDiv>
        );
    }
}

const mapStateToProps = ({ audio_playlist }: GlobalStateShape): MusicStateToProps => ({
    items: audio_playlist.items,
    flatItems: audio_playlist.flatItems,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<GlobalStateShape, undefined, Action>) => ({
    onScroll: (triggerHeight: number, scrollTop: number) => dispatch(onScroll(triggerHeight, scrollTop)),
    fetchPlaylistAction: (composer: string, piece: string, movement?: string) => dispatch(fetchPlaylistAction(composer, piece, movement)),
});

const ConnectedMusic = connect<MusicStateToProps, MusicDispatchToProps>(
    mapStateToProps,
    mapDispatchToProps,
)(Music);

export type MusicType = React.Component<MusicProps>;
export type RequiredProps = MusicOwnProps;
export default ConnectedMusic;
