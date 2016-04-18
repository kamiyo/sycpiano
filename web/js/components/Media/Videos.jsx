import '@/less/videos.less';

import React from 'react';
import ReactDOM from 'react-dom';
import {VelocityComponent, VelocityTransitionGroup} from 'velocity-react';
import VideoLoadingOverlay from '@/js/components/Media/VideoLoadingOverlay.jsx';
import VideoPlaylistToggler from '@/js/components/Media/VideoPlaylistToggler.jsx';
import VideoPlaylist from '@/js/components/Media/VideoPlaylist.jsx';
import youTube from '@/js/YouTube.js';

let PLAYLIST_WIDTH = 220; // includes 10px padding on each side

export default class Videos extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showPlaylist: false,
            playerReady: false,
            playingVideoId: '',
            videos: []
        };
    }

    onPlayerReady() {
        this.setState({ playerReady: true });
    }

    playlistItemOnClick(videoId) {
        this.setState({ playingVideoId: videoId });
    }

    playlistToggleOnClick(e) {
        this.setState({ showPlaylist: !this.state.showPlaylist });
        if (!this.state.showPlaylist) {
            Velocity(document.getElementById('player'), {width: `-=${PLAYLIST_WIDTH}`}, {duration: 400, easing: [170,26]});
        } else {
            Velocity(document.getElementById('player'), 'reverse');
        }
    }

    getVideosOnSuccess(response) {
        this.setState({
            playingVideoId: response.data.items[0].snippet.resourceId.videoId,
            videos: response.data.items
        });
    }

    getVideosOnError(response) {
        console.error(`get videos request failed: ${response}`);
    }

    componentWillMount() {
        youTube.getVideos()
            .then(this.getVideosOnSuccess.bind(this))
            .catch(this.getVideosOnError.bind(this));
    }

    componentDidMount() {
        youTube.initializePlayerOnElement(ReactDOM.findDOMNode(this));
        youTube.executeWhenPlayerReady(this.onPlayerReady.bind(this));
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.playerReady && this.state.showPlaylist === prevState.showPlaylist)
            youTube.loadVideoById(this.state.playingVideoId,
                prevState.playingVideoId && prevState.playerReady);
    }

    componentWillUnmount() {
        youTube.destroyPlayer();
    }

    render() {
        let overlayLeaveAnimation = { duration: 300, delay: 1000, animation: {opacity: 0} };
        let playlistExpandAnimation = { translateX: this.state.showPlaylist ? 0 : PLAYLIST_WIDTH };

        return (
            <div className="videos">
                <VelocityTransitionGroup leave={overlayLeaveAnimation} runOnMount={false}>
                    { this.state.playerReady ? undefined : <VideoLoadingOverlay/> }
                </VelocityTransitionGroup>

                <VelocityComponent animation={playlistExpandAnimation} duration={400} easing={[170,26]}>
                    <VideoPlaylistToggler isPlaylistVisible={this.state.showPlaylist}
                        onClick={this.playlistToggleOnClick.bind(this)} />
                </VelocityComponent>

                <VelocityComponent animation={playlistExpandAnimation} duration={400} easing={[170,26]}>
                    <VideoPlaylist ref="videoPlaylist"
                        videos={this.state.videos}
                        playlistItemOnClick={this.playlistItemOnClick.bind(this)} />
                </VelocityComponent>
            </div>
            );
    }
}