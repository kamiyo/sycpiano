import '@/less/Media/media-content.less';
import '@/less/Media/Videos/videos.less';

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { TweenLite } from 'gsap';
import { Transition } from 'react-transition-group';
import { connect } from 'react-redux';
import VideoLoadingOverlay from '@/js/components/Media/LoadingOverlay.jsx';
import PreviewOverlay from '@/js/components/Media/PreviewOverlay.jsx';
import VideoPlaylistToggler from '@/js/components/Media/PlaylistToggler.jsx';
import VideoPlaylist from '@/js/components/Media/Videos/VideoPlaylist.jsx';
//import ConnectPlaylistHOC from '@/js/components/Media/HigherOrder/ConnectPlaylistHOC.jsx';
import { createFetchPlaylistAction, playerIsReady } from '@/js/components/Media/Videos/actions.js';
import youTube from '@/js/YouTube.js';

const PLAYLIST_WIDTH = 550;

const slideLeft = (element) => {
    TweenLite.fromTo(element, 0.4, { x: 0 }, { x: -PLAYLIST_WIDTH, ease: "Power3.easeOut" });
}

const slideRight = (element) => {
    TweenLite.fromTo(element, 0.4, { x: -PLAYLIST_WIDTH }, { x: 0, ease: "Power3.easeOut" });
}

class Videos extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playerReady: false,
            playingVideoId: '',
            videos: {},
            isPreviewOverlay: true,
            shouldPlay: false
        };
    }

    onPlayerReady = () => {
        this.setState({
            playerReady: true,
            playingVideoId: this.state.videos[Object.keys(this.state.videos)[0]].id
        });
    }

    playlistItemOnClick = (videoId) => {
        this.setState({ playingVideoId: videoId, shouldPlay: true, isPreviewOverlay: false }, () => this.setState({ shouldPlay: false }));
        this.playlistAutoHideTimeout = setTimeout(() => {
            this.props.togglePlaylist(false);
        }, 250);
    }

    previewOverlayOnClick = () => {
        this.setState({ isPreviewOverlay: false, shouldPlay: true }, () => this.setState({ shouldPlay: false }));
    }

    getVideosOnSuccess = (response) => {
        response.data.items.forEach((video) => {
            Object.assign(this.playlistItems[video.id], video);
        });

        this.setState({
            videos: this.playlistItems
        }, () => {
            this.playlistItems = null;
        });

        setTimeout(() => this.props.togglePlaylist(true), 1000);
    }

    getVideosOnError = (response) => {
        console.error(`get videos request failed: ${response}`);
    }

    getPlaylistItemsOnSuccess = (response) => {
        console.log(response);
        this.playlistItems = {};
        response.data.items.forEach((item) => {
            this.playlistItems[item.snippet.resourceId.videoId] = item;
        });

        youTube.getVideos(Object.keys(this.playlistItems))
            .then(this.getVideosOnSuccess)
            .catch(this.getVideosOnError);
    }

    getPlaylistItemsOnError = (response) => {
        console.error(`get playlistItems request failed: ${response.status}`);
    }

    componentWillMount() {
        youTube.getPlaylistItems()
            .then(this.getPlaylistItemsOnSuccess)
            .catch(this.getPlaylistItemsOnError);
    }

    componentDidMount() {
        youTube.initializePlayerOnElement(ReactDOM.findDOMNode(this));
        youTube.executeWhenPlayerReady(this.onPlayerReady);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.shouldPlay === false && this.state.shouldPlay === true)
            youTube.loadVideoById(this.state.playingVideoId, true);
    }

    componentWillUnmount() {
        youTube.destroyPlayer();
    }

    render() {
        return (
            <div className="mediaContent videos">
                <Transition
                    in={this.state.isPreviewOverlay}
                    onExit={(el) => {TweenLite.fromTo(el, 0.3, { opacity: 1 }, { opacity: 0 })}}
                    timeout={300}
                    unmountOnExit={true}
                    appear={true}
                >
                    <PreviewOverlay onClick={this.previewOverlayOnClick} />
                </Transition>

                <Transition
                    in={!this.state.playerReady}
                    onExit={(el) => {TweenLite.fromTo(el, 0.3, { opacity: 1 }, { opacity: 0, delay: 1 })}}
                    timeout={300}
                    unmountOnExit={true}
                    appear={true}
                >
                    <VideoLoadingOverlay />
                </Transition>

                <Transition
                    in={this.props.showPlaylist}
                    onEnter={slideLeft}
                    onExit={slideRight}
                    timeout={400}
                >
                    <VideoPlaylistToggler
                        isPlaylistVisible={this.props.showPlaylist}
                        onClick={this.props.playlistToggleOnClick} />
                </Transition>

                <Transition
                    in={this.props.showPlaylist}
                    onEnter={slideLeft}
                    onExit={slideRight}
                    timeout={400}
                >
                    <VideoPlaylist
                        currentItemId={this.state.playingVideoId}
                        items={this.state.videos}
                        playlistRightOnChange={this.props.playlistRightOnChange}
                        playlistItemOnClick={this.playlistItemOnClick} />
                </Transition>
            </div>
        );
    }
}

Videos.propTypes = {
    showPlaylist: PropTypes.bool.isRequired,
    playlistRight: PropTypes.number.isRequired,
    playlistRightOnChange: PropTypes.func.isRequired,
    playlistToggleOnClick: PropTypes.func.isRequired,
    togglePlaylist: PropTypes.func.isRequired
};

export default connect(
    null,
    {
        createFetchPlaylistAction,
        playerIsReady
    }
)(Videos);
