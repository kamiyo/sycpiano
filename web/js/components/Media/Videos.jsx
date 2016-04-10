import '@/less/videos.less';

import React from 'react';
import ReactDOM from 'react-dom';
import YouTube from '@/js/YouTube.js';

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

    getVideosOnSuccess(data, textStatus, jqXHR) {
        this.setState({
            playingVideoId: data.items[0].snippet.resourceId.videoId,
            videos: data.items
        });
    }

    getVideosOnError(jqXHR, textStatus, errorThrown) {
        var errors = JSON.parse(jqXHR.responseText).error.errors;
        errors = errors.map((e) => { return e.message; }).join('\n');
        console.error(`get videos request failed: ${errors}`);
    }

    componentWillMount() {
        this.youTube.getVideos()
            .done(this.getVideosOnSuccess.bind(this))
            .fail(this.getVideosOnError.bind(this));
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
            </div>
            );
    }
}