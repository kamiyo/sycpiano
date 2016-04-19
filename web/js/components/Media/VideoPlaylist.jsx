import '@/less/video-playlist.less';

import React from 'react';
import ReactDOM from 'react-dom';
import VideoPlaylistItem from '@/js/components/Media/VideoPlaylistItem.jsx';

let paddingRight = 10;

export default class VideoPlaylist extends React.Component {
    componentDidUpdate() {
        let el = ReactDOM.findDOMNode(this);
        let scrollbarWidth = el.offsetWidth - el.clientWidth;
        el.style.right = `${-scrollbarWidth}px`;

        // el.style.paddingRight = `${paddingRight + scrollbarWidth}px`;
    }

    getWidth() {
        return ReactDOM.findDOMNode(this).getBoundingClientRect().width;
    }

    render() {
        let playlistItems = Object.keys(this.props.videos).map((id) => {
            let video = this.props.videos[id];
            return (
                <VideoPlaylistItem key={video.id}
                    isActive={this.props.playingVideoId === id}
                    video={video}
                    onClick={this.props.playlistItemOnClick}/>
                );
        });

        return (
            <div className="videoPlaylist">
                <ul>{playlistItems}</ul>
            </div>
            );
    }
}