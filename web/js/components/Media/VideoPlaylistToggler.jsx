import '@/less/video-playlist-toggler.less';

import React from 'react';

export default class VideoPlaylistToggler extends React.Component {
    render() {
        return (
            <div className="playlistToggler" onClick={this.props.onClick}>
                {!this.props.isPlaylistVisible ? '\u25C0' : '\u25B6'}
            </div>
            );
    }
}