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
            isShow={props.isShow}
            hasToggler={true}
            togglePlaylist={props.togglePlaylistAction}
            shouldAppear={false}
        >
            {props.videos.map((video) => (
                <VideoPlaylistItem
                    key={video.id}
                    item={video}
                    currentItemId={props.videoId}
                    onClick={props.playVideo}
                />
            ))}
        </Playlist>
    );
};

const mapStateToProps = (state: GlobalStateShape): VideoPlaylistStateToProps => ({
    videos: state.video_playlist.items,
    videoId: state.video_player.videoId,
    isShow: state.video_playlist.isShow,
});

const mapDispatchToProps: VideoPlaylistDispatchToProps = {
    playVideo,
    togglePlaylistAction,
};

export default connect<VideoPlaylistStateToProps, VideoPlaylistDispatchToProps>(
    mapStateToProps,
    mapDispatchToProps,
)(VideoPlaylist);
