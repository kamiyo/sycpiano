import 'less/Media/Videos/video-playlist.less';

import * as React from 'react';
import { connect } from 'react-redux';

import Playlist from 'js/components/Media/Playlist';
import VideoPlaylistItem from 'js/components/Media/Videos/VideoPlaylistItem';

import { playVideo, togglePlaylistAction } from 'js/components/Media/Videos/actions';

import { VideoItemShape } from 'js/components/Media/Videos/types';
import { GlobalStateShape } from 'js/types';

interface VideoPlaylistStateToProps {
    videos: VideoItemShape[];
    videoId: string;
    isShow: boolean;
}

interface VideoPlaylistDispatchToProps {
    playVideo: (id?: string) => void;
    togglePlaylistAction: () => void;
}

type VideoPlaylistProps = VideoPlaylistStateToProps & VideoPlaylistDispatchToProps;

const VideoPlaylist = (props: VideoPlaylistProps) => {
    return (
        <Playlist
            className='videoPlaylist'
            isShow={props.isShow}
            hasToggler={true}
            togglePlaylist={props.togglePlaylistAction}
            items={props.videos}
            currentItemId={props.videoId}
            onClick={props.playVideo}
            ChildRenderer={VideoPlaylistItem}
        />
    );
};

const mapStateToProps = (state: GlobalStateShape) => ({
    videos: state.video_playlist.items,
    videoId: state.video_player.videoId,
    isShow: state.video_playlist.isShow,
});

export default connect(
    mapStateToProps,
    {
        playVideo,
        togglePlaylistAction,
    },
)(VideoPlaylist);
