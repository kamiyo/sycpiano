import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';

import LoadingOverlay from 'src/components/Media/LoadingOverlay';
import PreviewOverlay from 'src/components/Media/Videos/PreviewOverlay';
import VideoPlaylist from 'src/components/Media/Videos/VideoPlaylist';

import { createFetchPlaylistAction, initializeYoutubeElement, resetPlayer } from 'src/components/Media/Videos/actions';
import { GlobalStateShape } from 'src/types';

import { pushed } from 'src/styles/mixins';

interface VideosStateToProps {
    readonly videoId: string;
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
                <LoadingOverlay />
                <VideoPlaylist />
            </StyledVideos>
        );
    }
}

const mapStateToProps = (state: GlobalStateShape): VideosStateToProps => ({
    videoId: state.video_player.videoId,
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
