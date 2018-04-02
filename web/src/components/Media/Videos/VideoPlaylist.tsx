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
    readonly playVideo: typeof playVideo;
    readonly togglePlaylistAction: typeof togglePlaylistAction;
}

type VideoPlaylistProps = VideoPlaylistStateToProps & VideoPlaylistDispatchToProps;

const VideoPlaylist: React.SFC<VideoPlaylistProps> = ({
    isShow,
    togglePlaylistAction: togglePlaylist,
    videos,
    videoId,
    playVideo: play,
}) => (
        <Playlist
            isShow={isShow}
            hasToggler={true}
            togglePlaylist={togglePlaylist}
            shouldAppear={false}
        >
            {videos.map((video) => (
                <VideoPlaylistItem
                    key={video.id}
                    item={video}
                    currentItemId={videoId}
                    onClick={play}
                />
            ))}
        </Playlist>
    );

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
