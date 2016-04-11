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

        el.style.paddingRight = `${paddingRight + scrollbarWidth}px`;
    }

    getWidth() {
        return ReactDOM.findDOMNode(this).getBoundingClientRect().width;
    }

    render() {
        let playlistItems = this.props.videos.map((video) => {
            return <VideoPlaylistItem key={video.id} video={video} onClick={this.props.playlistItemOnClick}/>
        });

        return (
            <div className="videoPlaylist">
                <ul>{playlistItems}</ul>
            </div>
            );
    }
}