import * as React from 'react';
import { css } from 'react-emotion';
import ReactMedia from 'react-media';
import { connect, Dispatch } from 'react-redux';
import { match } from 'react-router';

import TweenLite from 'gsap/TweenLite';

import { fetchPlaylistAction } from 'src/components/Media/Music/actions';
import AudioInfo from 'src/components/Media/Music/AudioInfo';
import AudioUI from 'src/components/Media/Music/AudioUI';
import AudioVisualizer from 'src/components/Media/Music/AudioVisualizer';
import MusicPlaylist from 'src/components/Media/Music/MusicPlaylist';
import { constantQ, firLoader, waveformLoader } from 'src/components/Media/Music/VisualizationUtils';
import { getAudioContext } from 'src/utils';

import { MusicFileItem, MusicItem } from 'src/components/Media/Music/types';
import { GlobalStateShape } from 'src/types';

import { pushed } from 'src/styles/mixins';
import { reactMediaMobileQuery } from 'src/styles/screens';

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
    readonly items: MusicItem[];
}

interface MusicDispatchToProps {
    readonly fetchPlaylistAction: (trackId: string) => Promise<MusicFileItem>;
}

interface MusicOwnProps {
    baseRoute: string;
    match: match<any>;
}

type MusicProps = MusicOwnProps & MusicStateToProps & MusicDispatchToProps;

const musicStyle = css`
    ${pushed}
    position: relative;
    width: 100%;
    background-color: black;
    overflow-y: auto;
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
            const firstTrack = await this.props.fetchPlaylistAction(this.props.match.params.track);
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
                ...this.props.items.find((music) => {
                    return music.id === track.musicId;
                }),
                musicFiles: [track],
            },
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
        return (
            <ReactMedia query={reactMediaMobileQuery} >
                {(matches: boolean) =>
                    <div className={musicStyle}>
                        <audio id="audio" crossOrigin="anonymous" ref={(audio) => this.audio = audio} />
                        <MusicPlaylist
                            audio={this.audio}
                            onClick={this.loadTrack}
                            currentTrackId={(this.state.currentTrack) ? this.state.currentTrack.musicFiles[0].id : ''}
                            baseRoute={this.props.baseRoute}
                            userInput={this.state.userInput}
                            onFirstUserInput={this.onFirstUserInput}
                            isMobile={matches}
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
                            isMobile={matches}
                            isLoading={this.state.isLoading}
                        />
                        <AudioInfo
                            duration={this.state.duration}
                            currentPosition={this.state.playbackPosition}
                            currentTrack={this.state.currentTrack}
                            isMobile={matches}
                        />
                        <AudioVisualizer
                            currentPosition={this.state.playbackPosition}
                            analyzers={[this.analyzerL, this.analyzerR]}
                            isPlaying={this.state.isPlaying}
                            duration={this.state.duration}
                            prevTimestamp={this.state.lastUpdateTimestamp}
                            volume={this.state.volume}
                            isMobile={matches}
                        />
                    </div>
                }
            </ReactMedia>
        );
    }
}

const mapStateToProps = (state: GlobalStateShape): MusicStateToProps => ({
    items: state.audio_playlist.items,
});

const mapDispatchToProps = (dispatch: Dispatch<GlobalStateShape>): MusicDispatchToProps => ({
    fetchPlaylistAction: (track: string) => dispatch(fetchPlaylistAction(track)),
});

export default connect<MusicStateToProps, MusicDispatchToProps>(
    mapStateToProps,
    mapDispatchToProps,
)(Music);
