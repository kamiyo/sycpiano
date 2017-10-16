import '@/less/Media/Videos/playlist-toggler.less';
import PropTypes from 'prop-types';

import React from 'react';

export default class PlaylistToggler extends React.Component {
    render() {
        return (
            <div className="playlistToggler" onClick={this.props.onClick}>
                {!this.props.isPlaylistVisible ? '\u25C0' : '\u25B6'}
            </div>
            );
    }
}

PlaylistToggler.propTypes = {
    isPlaylistVisible: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};
