import '@/less/Media/media-content.less';
import '@/less/Media/Videos/videos.less';

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { TweenLite } from 'gsap';
import { Transition } from 'react-transition-group';
import { connect } from 'react-redux';
import LoadingOverlay from '@/js/components/Media/LoadingOverlay.jsx';
import PreviewOverlay from '@/js/components/Media/Videos/PreviewOverlay.jsx';
import VideoPlaylist from '@/js/components/Media/Videos/VideoPlaylist.jsx';
import { createFetchPlaylistAction, resetPlayer, initializeYoutubeElement } from '@/js/components/Media/Videos/actions.js';
import youTube from '@/js/YouTube.js';

class Videos extends React.Component {
    componentDidMount() {
        this.props.createFetchPlaylistAction(youTube.getPlaylistItems, youTube.getVideos);
        this.props.initializeYoutubeElement(this.domElement);
    }

    componentWillUnmount() {
        this.props.resetPlayer();
    }

    render() {
        return (
            <div
                className="mediaContent videos"
                ref={(div) => this.domElement = div}
            >
                <PreviewOverlay />
                <LoadingOverlay />
                <VideoPlaylist />
            </div>
        );
    }
}

Videos.propTypes = {
    videoId: PropTypes.string.isRequired,
    createFetchPlaylistAction: PropTypes.func.isRequired,
    initializeYoutubeElement: PropTypes.func.isRequired,
    resetPlayer: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    videoId: state.video_player.videoId
})

export default connect(
    mapStateToProps,
    {
        initializeYoutubeElement,
        createFetchPlaylistAction,
        resetPlayer,
    }
)(Videos);
