import '@/less/Media/Videos/video-playlist-toggler.less';

import React from 'react';

let PLAYLIST_WIDTH = 550;

export default class VideoPlaylistToggler extends React.Component {
    render() {
        let style = { right: PLAYLIST_WIDTH + this.props.playlistRight };

        return (
            <div className="playlistToggler" style={style} onClick={this.props.onClick}>
                {!this.props.isPlaylistVisible ? '\u25C0' : '\u25B6'}
            </div>
            );
    }
}
