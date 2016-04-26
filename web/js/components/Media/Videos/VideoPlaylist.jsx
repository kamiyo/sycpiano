import '@/less/video-playlist.less';

import React from 'react';
import ReactDOM from 'react-dom';
import PlaylistManagerHOC from '@/js/components/Media/HigherOrder/PlaylistManagerHOC.jsx';
import VideoPlaylistItem from '@/js/components/Media/VideoPlaylistItem.jsx';

class _VideoPlaylist extends React.Component {
    render() {
        let playlistItems = Object.keys(this.props.items).map((id) => {
            let item = this.props.items[id];
            return (
                <VideoPlaylistItem key={item.id}
                    isActive={this.props.currentItemId === id}
                    video={item}
                    onClick={this.props.playlistItemOnClick} />
                );
        });

        return (
            <div className="videoPlaylist">
                <ul>{playlistItems}</ul>
            </div>
            );
    }
}

const VideoPlaylist = PlaylistManagerHOC(_VideoPlaylist);

export default VideoPlaylist;