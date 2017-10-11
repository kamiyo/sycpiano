import '@/less/Media/media-content.less';
import '@/less/Media/Videos/videos.less';

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { TweenLite } from 'gsap';
import { Transition } from 'react-transition-group';
import { connect } from 'react-redux';
import LoadingOverlay from '@/js/components/Media/LoadingOverlay.jsx';
import PreviewOverlay from '@/js/components/Media/PreviewOverlay.jsx';
import VideoPlaylist from '@/js/components/Media/Videos/VideoPlaylist.jsx';
import { createFetchPlaylistAction, playerIsReady, resetPlayer } from '@/js/components/Media/Videos/actions.js';
import youTube from '@/js/YouTube.js';

class Videos extends React.Component {
    componentDidMount() {
        this.props.createFetchPlaylistAction(youTube.getPlaylistItems, youTube.getVideos);
        youTube.initializePlayerOnElement(ReactDOM.findDOMNode(this));
        youTube.executeWhenPlayerReady(this.props.playerIsReady);
    }

    componentWillUnmount() {
        this.props.resetPlayer();
        youTube.destroyPlayer();
    }

    playYoutubeVideo = (videoId = this.props.videoId) => {
        youTube.loadVideoById(videoId, true);
    }

    render() {
        return (
            <div className="mediaContent videos">
                <PreviewOverlay playYoutubeVideo={this.playYoutubeVideo} />
                <LoadingOverlay />
                <VideoPlaylist playYoutubeVideo={this.playYoutubeVideo} />
            </div>
        );
    }
}

Videos.propTypes = {
    shouldPlay: PropTypes.bool.isRequired,
    videoId: PropTypes.string.isRequired,
    createFetchPlaylistAction: PropTypes.func.isRequired,
    playerIsReady: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    shouldPlay: state.video_player.shouldPlay,
    videoId: state.video_player.videoId
})

export default connect(
    mapStateToProps,
    {
        createFetchPlaylistAction,
        playerIsReady,
        resetPlayer,
    }
)(Videos);
