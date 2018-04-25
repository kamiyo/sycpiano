import * as React from 'react';
import styled from 'react-emotion';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Transition } from 'react-transition-group';

import TweenLite from 'gsap/TweenLite';

import { LoadingInstance } from 'src/components/LoadingSVG';
import PreviewOverlay from 'src/components/Media/Videos/PreviewOverlay';
import VideoPlaylist from 'src/components/Media/Videos/VideoPlaylist';

import { setOnScroll } from 'src/components/App/NavBar/actions';
import { createFetchPlaylistAction, initializeYoutubeElement, playVideo, resetPlayer } from 'src/components/Media/Videos/actions';
import { GlobalStateShape } from 'src/types';

import { pushed } from 'src/styles/mixins';
import { screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';

interface VideosStateToProps {
    readonly videoId: string;
    readonly isPlayerReady: boolean;
    readonly onScroll: (event: React.SyntheticEvent<HTMLElement>) => void;
}

interface VideosDispatchToProps {
    readonly createFetchPlaylistAction: typeof createFetchPlaylistAction;
    readonly initializeYoutubeElement: typeof initializeYoutubeElement;
    readonly resetPlayer: typeof resetPlayer;
    readonly setOnScroll: typeof setOnScroll;
    readonly playVideo: typeof playVideo;
}

interface VideosOwnProps {
    readonly isMobile: boolean;
}

type VideosProps = VideosStateToProps & VideosDispatchToProps & VideosOwnProps & RouteComponentProps<{ videoId?: string; }>;

const StyledVideos = styled('div') `
    ${pushed}
    width: 100%;
    background-color: black;
    position: relative;

    ${/* sc-selector */ screenXSorPortrait} {
        overflow-y: scroll;
        margin-top: 0;
        padding-top: ${navBarHeight.mobile}px;
        height: 100%;
    }

    iframe {
        width: 100%;
        height: 100%;

        ${/* sc-selector */ screenXSorPortrait} {
            position: fixed;
            top: ${navBarHeight.mobile}px;
            height: 56.25vw;
            z-index: 5;
            box-shadow: 0 0 7px 2px rgba(0, 0, 0, 0.5);
        }
    }
`;

const LoadingOverlayDiv = styled('div') `
    width: 100%;
    height: 100%;
    z-index: 11;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(60, 60, 60, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
`;

class Videos extends React.Component<VideosProps, any> {
    domElement: React.RefObject<HTMLDivElement> = React.createRef();

    componentDidMount() {
        this.props.createFetchPlaylistAction();
        this.props.initializeYoutubeElement(this.domElement.current, this.props.match.params.videoId, this.props.isMobile);
    }

    componentWillUnmount() {
        this.props.resetPlayer();
    }

    render() {
        return (
            <>
                <Helmet>
                    <meta name="description" content="YouTube playlist of Sean Chen's performance videos." />
                </Helmet>
                <StyledVideos
                    innerRef={this.domElement}
                >
                    <PreviewOverlay isMobile={this.props.isMobile} />
                    <Transition
                        in={!this.props.isPlayerReady}
                        onExit={(el) => TweenLite.to(el, 0.3, { autoAlpha: 0 })}
                        timeout={300}
                        mountOnEnter={true}
                        unmountOnExit={true}
                    >
                        <LoadingOverlayDiv>
                            <LoadingInstance width={120} height={120} />
                        </LoadingOverlayDiv>
                    </Transition>
                    <VideoPlaylist isMobile={this.props.isMobile} />
                </StyledVideos>
            </>
        );
    }
}

const mapStateToProps = ({ video_player, navbar }: GlobalStateShape): VideosStateToProps => ({
    videoId: video_player.videoId,
    isPlayerReady: video_player.isPlayerReady,
    onScroll: navbar.onScroll,
});

const mapDispatchToProps: VideosDispatchToProps = {
    initializeYoutubeElement,
    createFetchPlaylistAction,
    resetPlayer,
    setOnScroll,
    playVideo,
};

const ConnectedVideos = connect<VideosStateToProps, VideosDispatchToProps, VideosOwnProps>(
    mapStateToProps,
    mapDispatchToProps,
)(Videos);

export type VideosType = typeof ConnectedVideos;
export default ConnectedVideos;
