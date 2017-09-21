import '@/less/Media/Videos/video-playlist-toggler.less';

import React from 'react';
import PropTypes from 'prop-types';

const VideoPlaylistToggler = (props) => (
    <div className="playlistToggler" onClick={props.onClick}>
        {props.isPlaylistVisible ? '\u25B6' : '\u25C0'}
    </div>
);

VideoPlaylistToggler.PropTypes = {
    onClick: props.func.isRequired,
    isPlaylistVisible: props.bool.isRequired
}

export default VideoPlaylistToggler;