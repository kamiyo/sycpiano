import '@/less/video-playlist.less';

import React from 'react';
import ReactDOM from 'react-dom';
import VideoPlaylistItem from '@/js/components/Media/VideoPlaylistItem.jsx';

export default class VideoPlaylist extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        // Necessary to prevent infinite updates, since calling props.playlistRightOnChange
        // causes a state change on the parent, which propagates back down to this component.
        return nextProps.playingVideoId !== this.props.playingVideoId;
    }

    componentDidUpdate() {
        let el = ReactDOM.findDOMNode(this);
        let scrollbarWidth = el.offsetWidth - el.clientWidth;
        el.style.right = el.style.paddingRight = `${-scrollbarWidth}px`;
        this.props.playlistRightOnChange(-scrollbarWidth);
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