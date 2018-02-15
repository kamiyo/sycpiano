import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';
import { Transition } from 'react-transition-group';

import TweenLite from 'gsap/TweenLite';

import { LoadingInstance } from 'src/components/LoadingSVG';
import PreviewOverlay from 'src/components/Media/Videos/PreviewOverlay';
import VideoPlaylist from 'src/components/Media/Videos/VideoPlaylist';

import { createFetchPlaylistAction, initializeYoutubeElement, resetPlayer } from 'src/components/Media/Videos/actions';
import { GlobalStateShape } from 'src/types';

import { pushed } from 'src/styles/mixins';

interface VideosStateToProps {
    readonly videoId: string;
    readonly isPlayerReady: boolean;
}

interface VideosDispatchToProps {
    readonly createFetchPlaylistAction: () => void;
    readonly initializeYoutubeElement: (el: HTMLElement) => void;
    readonly resetPlayer: () => void;
}

type VideosProps = VideosStateToProps & VideosDispatchToProps;

const StyledVideos = styled('div')`
    ${pushed}
    width: 100%;
    background-color: black;

    iframe {
        width: 100%;
        height: 100%;
    }
`;

const LoadingOverlayDiv = styled('div')`
    width: 100%;
    height: 100%;
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(60, 60, 60, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
`;

class Videos extends React.Component<VideosProps, any> {
    domElement: HTMLElement;

    componentDidMount() {
        this.props.createFetchPlaylistAction();
        this.props.initializeYoutubeElement(this.domElement);
    }

    componentWillUnmount() {
        this.props.resetPlayer();
    }

    render() {
        return (
            <StyledVideos innerRef={(div) => this.domElement = div}>
                <PreviewOverlay />
                <Transition
                    in={!this.props.isPlayerReady}
                    onExit={(el) => { TweenLite.fromTo(el, 0.3, { opacity: 1 }, { opacity: 0 }); }}
                    timeout={300}
                    mountOnEnter={true}
                    unmountOnExit={true}
                >
                    <LoadingOverlayDiv>
                        <LoadingInstance width={120} height={120} />
                    </LoadingOverlayDiv>
                </Transition>
                <VideoPlaylist />
            </StyledVideos>
        );
    }
}

const mapStateToProps = (state: GlobalStateShape): VideosStateToProps => ({
    videoId: state.video_player.videoId,
    isPlayerReady: state.video_player.isPlayerReady,
});

const mapDispatchToProps: VideosDispatchToProps = {
    initializeYoutubeElement,
    createFetchPlaylistAction,
    resetPlayer,
};

export default connect<VideosStateToProps, VideosDispatchToProps>(
    mapStateToProps,
    mapDispatchToProps,
)(Videos);
