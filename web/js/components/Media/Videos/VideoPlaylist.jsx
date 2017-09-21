import '@/less/Media/Videos/video-playlist.less';

import React from 'react';
import ReactDOM from 'react-dom';
import PlaylistManagerHOC from '@/js/components/Media/HigherOrder/PlaylistManagerHOC.jsx';
import VideoPlaylistItem from '@/js/components/Media/Videos/VideoPlaylistItem.jsx';

const VideoPlaylist = (props) => {
    let playlistItems = Object.keys(props.items).map((id) => {
        let item = props.items[id];
        return (
            <VideoPlaylistItem key={item.id}
                isActive={props.currentItemId === id}
                video={item}
                onClick={props.playlistItemOnClick} />
            );
    });

    return (
        <div className="videoPlaylist">
            <ul>{playlistItems}</ul>
        </div>
        );
}

export default PlaylistManagerHOC(VideoPlaylist);
