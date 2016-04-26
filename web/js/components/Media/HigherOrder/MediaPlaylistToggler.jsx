import React from 'react';

export default class MediaPlaylistToggler extends React.Component {
    render() {
        let style = { right: this.props.playlistWidth + this.props.playlistRight };

        return (
            <div className="mediaPlaylistToggler" style={style} onClick={this.props.onClick}>
                {!this.props.isPlaylistVisible ? '\u25C0' : '\u25B6'}
            </div>
            );
    }
}

MediaPlaylistToggler.propTypes = {
    playlistWidth: React.PropTypes.number.isRequired,
    playlistRight: React.PropTypes.number.isRequired,
    isPlaylistVisible: React.PropTypes.bool.isRequired,
    onClick: React.PropTypes.func.isRequired
};