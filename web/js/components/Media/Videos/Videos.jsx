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
    componentWillMount() {
        this.props.createFetchPlaylistAction(youTube.getPlaylistItems, youTube.getVideos);
    }

    componentDidMount() {
        youTube.initializePlayerOnElement(ReactDOM.findDOMNode(this));
        youTube.executeWhenPlayerReady(this.props.playerIsReady);
    }

    // write function to handle spacebar presses for embedded iframe youtube

    playYoutubeVideo = (videoId = this.props.videoId) => {
        youTube.loadVideoById(videoId, true);
    }

    componentWillUnmount() {
        this.props.resetPlayer();
        youTube.destroyPlayer();
    }

    render() {
        return (
            <div className="mediaContent videos">
                <PreviewOverlay playYoutubeVideo={this.playYoutubeVideo} />
                <LoadingOverlay />

                {/* <Transition
                    in={this.props.showPlaylist}
                    onEnter={slideLeft}
                    onExit={slideRight}
                    timeout={400}
                >
                </Transition> */}
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
