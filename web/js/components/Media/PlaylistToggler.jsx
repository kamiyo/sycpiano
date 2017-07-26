import '@/less/Media/Videos/playlist-toggler.less';
import PropTypes from 'prop-types';

import React from 'react';

export default class PlaylistToggler extends React.Component {
    render() {
        let style = { right: this.props.playlistWidth + this.props.playlistRight };

        return (
            <div className="playlistToggler" style={style} onClick={this.props.onClick}>
                {!this.props.isPlaylistVisible ? '\u25C0' : '\u25B6'}
            </div>
            );
    }
}

PlaylistToggler.propTypes = {
    playlistWidth: PropTypes.number.isRequired,
    playlistRight: PropTypes.number.isRequired,
    isPlaylistVisible: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};
