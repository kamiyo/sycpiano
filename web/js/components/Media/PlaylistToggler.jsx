import '@/less/Media/playlist-toggler.less';

import React from 'react';
import PropTypes from 'prop-types';

const PlaylistToggler = (props) => (
    <div className="playlistToggler no-highlight" onClick={props.onClick}>
        {props.isPlaylistVisible ? '\u25B6' : '\u25C0'}
    </div>
);

PlaylistToggler.PropTypes = {
    onClick: PropTypes.func.isRequired,
    isPlaylistVisible: PropTypes.bool.isRequired
}

export default PlaylistToggler;