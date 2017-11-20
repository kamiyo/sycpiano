import 'less/Media/Music/music-playlist.less';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MusicPlaylistItem from 'js/components/Media/Music/MusicPlaylistItem.jsx';
import Playlist from 'js/components/Media/Playlist.jsx'

const MusicPlaylist = (props) => {
    return (
        <Playlist
            className="musicPlaylist"
            isShow={true}
            hasToggler={false}
            items={props.items}
            currentItemId={props.currentTrack.id}
            onClick={props.onClick}
            ChildRenderer={(childProps) => <MusicPlaylistItem {...childProps} baseRoute={props.baseRoute} />}
        />
    )
}

MusicPlaylist.propTypes = {
    baseRoute: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    currentTrack: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    items: state.audio_playlist.items,
})

export default connect(
    mapStateToProps,
    null
)(MusicPlaylist);
