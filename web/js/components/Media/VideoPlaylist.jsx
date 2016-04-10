import '@/less/video-playlist.less';

import React from 'react';
import ReactDOM from 'react-dom';
import VideoPlaylistItem from '@/js/components/Media/VideoPlaylistItem.jsx';

export default class VideoPlaylist extends React.Component {
    componentDidUpdate() {
        let el = ReactDOM.findDOMNode(this);
        let scrollbarWidth = el.offsetWidth - el.clientWidth;
        el.style.right = `${-scrollbarWidth}px`;
    }

    render() {
        let playlistItems = this.props.videos.map((video) => {
            return <VideoPlaylistItem key={video.id} video={video} />
        });

        return (
            <div className="videoPlaylist">
                <ul>{playlistItems}</ul>
            </div>
            );
    }
}