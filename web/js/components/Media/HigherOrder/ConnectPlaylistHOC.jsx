import React from 'react';

const ConnectPlaylistHOC = (Component) => class _ConnectPlaylistHOC extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showPlaylist: false,
            playlistRight: 0 // playlist offset to hide scrollbar if it is visible
        }
    }

    playlistRightOnChange(playlistRight) {
        this.setState({ playlistRight: playlistRight });
    }

    playlistToggleOnClick(e) {
        this.setState({ showPlaylist: !this.state.showPlaylist });
    }

    togglePlaylist(showPlaylist) {
        this.setState({ showPlaylist: showPlaylist });
    }

    render() {
        return (
            <Component {...this.props} {...this.state}
                playlistRightOnChange={this.playlistRightOnChange.bind(this)}
                playlistToggleOnClick={this.playlistToggleOnClick.bind(this)}
                togglePlaylist={this.togglePlaylist.bind(this)} />
            );
    }
}

export default ConnectPlaylistHOC;