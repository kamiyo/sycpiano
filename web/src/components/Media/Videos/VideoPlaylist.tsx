import 'less/Media/Videos/video-playlist.less';

import * as React from 'react';
import { connect } from 'react-redux';

import Playlist from 'src/components/Media/Playlist';
import VideoPlaylistItem from 'src/components/Media/Videos/VideoPlaylistItem';

import { playVideo, togglePlaylistAction } from 'src/components/Media/Videos/actions';

import { VideoItemShape } from 'src/components/Media/Videos/types';
import { GlobalStateShape } from 'src/types';

interface VideoPlaylistStateToProps {
    readonly videos: VideoItemShape[];
    readonly videoId: string;
    readonly isShow: boolean;
}

interface VideoPlaylistDispatchToProps {
    readonly playVideo: (id?: string) => void;
    readonly togglePlaylistAction: () => void;
}

type VideoPlaylistProps = VideoPlaylistStateToProps & VideoPlaylistDispatchToProps;

const VideoPlaylist: React.SFC<VideoPlaylistProps> = (props) => {
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

export default connect<VideoPlaylistStateToProps, VideoPlaylistDispatchToProps>(
    mapStateToProps,
    {
        playVideo,
        togglePlaylistAction,
    },
)(VideoPlaylist);
