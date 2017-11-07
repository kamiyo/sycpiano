import '@/less/Media/Videos/video-playlist.less';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VideoPlaylistItem from '@/js/components/Media/Videos/VideoPlaylistItem.jsx';
import { playVideo, togglePlaylistAction } from '@/js/components/Media/Videos/actions.js';
import Playlist from '@/js/components/Media/Playlist.jsx'

const VideoPlaylist = (props) => {
    return (
        <Playlist
            className="videoPlaylist"
            isShow={props.isShow}
            isAppear={true}
            hasToggler={true}
            togglePlaylist={props.togglePlaylistAction}
            items={props.videos}
            currentItemId={props.videoId}
            onClick={props.playVideo}
            ChildRenderer={VideoPlaylistItem}
        />
    )
}

VideoPlaylist.PropTypes = {
    videos: PropTypes.array.isRequired,
    isShow: PropTypes.bool.isRequired,
    playVideo: PropTypes.func.isRequired,
    togglePlaylistAction: PropTypes.func.isRequired,
    videoId: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
    videos: state.video_playlist.items,
    videoId: state.video_player.videoId,
    isShow: state.video_playlist.isShow
})

export default connect(
    mapStateToProps,
    {
        playVideo,
        togglePlaylistAction
    }
)(VideoPlaylist);
