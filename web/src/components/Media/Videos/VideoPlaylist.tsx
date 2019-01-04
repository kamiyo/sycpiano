import * as React from 'react';
import { connect } from 'react-redux';

import { css } from '@emotion/core';
import styled from '@emotion/styled';

import Playlist from 'src/components/Media/Playlist';
import { playVideo, togglePlaylistAction } from 'src/components/Media/Videos/actions';
import { VideoItemShape } from 'src/components/Media/Videos/types';
import VideoPlaylistItem from 'src/components/Media/Videos/VideoPlaylistItem';

import { screenXSorPortrait } from 'src/styles/screens';
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

interface VideoOwnProps {
    readonly isMobile: boolean;
}

type VideoPlaylistProps = VideoOwnProps & VideoPlaylistStateToProps & VideoPlaylistDispatchToProps;

const videoPlaylistStyle = css`
    ${screenXSorPortrait} {
        top: 56.25vw;
        position: relative;
        overflow: visible;
    }
`;

const StyledPlaylistContainer = styled.div`
    width: fit-content;
    height: 100%;
    right: 0;
    position: absolute;

    ${screenXSorPortrait} {
        width: 100%;
        height: auto;
        position: absolute;
        right: unset;
        z-index: 0;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
    }
`;

const VideoPlaylist: React.FC<VideoPlaylistProps> = ({
    isShow,
    togglePlaylistAction: togglePlaylist,
    videos,
    videoId,
    isMobile,
    playVideo: play,
}) => (
        <StyledPlaylistContainer>
            <Playlist
                extraStyles={{ div: videoPlaylistStyle }}
                isShow={isShow}
                hasToggler={!isMobile}
                togglePlaylist={togglePlaylist}
                shouldAppear={false}
                isMobile={isMobile}
            >
                {videos.map((video) => (
                    <VideoPlaylistItem
                        key={video.id}
                        item={video}
                        currentItemId={videoId}
                        onClick={play}
                        isMobile={isMobile}
                    />
                ))}
            </Playlist>
        </StyledPlaylistContainer>
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

export default connect<VideoPlaylistStateToProps, VideoPlaylistDispatchToProps, VideoOwnProps>(
    mapStateToProps,
    mapDispatchToProps,
)(VideoPlaylist);
