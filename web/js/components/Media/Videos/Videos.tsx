import 'less/Media/media-content.less';
import 'less/Media/Videos/videos.less';

import * as React from 'react';
import { connect } from 'react-redux';

import LoadingOverlay from 'js/components/Media/LoadingOverlay';
import PreviewOverlay from 'js/components/Media/Videos/PreviewOverlay';
import VideoPlaylist from 'js/components/Media/Videos/VideoPlaylist';

import { createFetchPlaylistAction, initializeYoutubeElement, resetPlayer } from 'js/components/Media/Videos/actions';
import { GlobalStateShape } from 'js/types';

interface VideosStateToProps {
    videoId: string;
}

interface VideosDispatchToProps {
    createFetchPlaylistAction: () => void;
    initializeYoutubeElement: (el: HTMLElement) => void;
    resetPlayer: () => void;
}

type VideosProps = VideosStateToProps & VideosDispatchToProps;

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
            <div
                className='mediaContent videos'
                ref={(div) => this.domElement = div}
            >
                <PreviewOverlay />
                <LoadingOverlay />
                <VideoPlaylist />
            </div>
        );
    }
}

const mapStateToProps = (state: GlobalStateShape) => ({
    videoId: state.video_player.videoId,
});

export default connect<VideosStateToProps, VideosDispatchToProps>(
    mapStateToProps,
    {
        initializeYoutubeElement,
        createFetchPlaylistAction,
        resetPlayer,
    },
)(Videos);
