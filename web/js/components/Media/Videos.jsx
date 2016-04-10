import '@/less/videos.less';

import React from 'react';
import ReactDOM from 'react-dom';
import YouTube from '@/js/YouTube.js';
import VideoPlaylist from '@/js/components/Media/VideoPlaylist.jsx';

export default class Videos extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playerReady: false,
            playingVideoId: '',
            videos: []
        };

        this.youTube = new YouTube(this.onPlayerReady.bind(this));
    }

    onPlayerReady() {
        this.setState({ playerReady: true });
    }

    playlistItemOnClick(videoId) {
        this.setState({ playingVideoId: videoId });
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
        this.youTube.getVideos()
            .then(this.getVideosOnSuccess.bind(this))
            .catch(this.getVideosOnError.bind(this));
    }

    componentDidMount() {
        this.youTube.initializePlayerOnElement(ReactDOM.findDOMNode(this));
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.playerReady)
            this.youTube.loadVideoById(this.state.playingVideoId, prevState.playerReady);
    }

    render() {
        return (
            <div className="videos">
                <VideoPlaylist videos={this.state.videos} playlistItemOnClick={this.playlistItemOnClick.bind(this)}/>
            </div>
            );
    }
}