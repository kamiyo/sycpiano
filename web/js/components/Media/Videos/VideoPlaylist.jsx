import '@/less/Media/Videos/video-playlist.less';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Transition } from 'react-transition-group';
import { TweenLite } from 'gsap';
import VideoPlaylistItem from '@/js/components/Media/Videos/VideoPlaylistItem.jsx';
import VideoPlaylistToggler from '@/js/components/Media/PlaylistToggler.jsx';
import { clickPlaylistItem, togglePlaylistAction } from '@/js/components/Media/Videos/actions.js';

const PLAYLIST_WIDTH = 550;

const slideLeft = (element) => {
    TweenLite.fromTo(element, 0.4, { x: 0 }, { x: -PLAYLIST_WIDTH, ease: "Power3.easeOut" });
}

const slideRight = (element) => {
    TweenLite.fromTo(element, 0.4, { x: -PLAYLIST_WIDTH }, { x: 0, ease: "Power3.easeOut" });
}

const VideoPlaylist = (props) => (
    <Transition
        in={props.isShow}
        onEnter={slideLeft}
        onExit={slideRight}
        timeout={400}
    >
        <div className="videoPlaylist">
            <VideoPlaylistToggler
                isPlaylistVisible={props.isShow}
                onClick={props.togglePlaylistAction} />
            <ul>
                {props.videos.map((video, i) => {
                    return (
                        <VideoPlaylistItem
                            key={video.id}
                            isActive={props.videoId === id}
                            video={vide}
                            onClick={props.clickPlaylistItem}
                        />
                    )
                })}
            </ul>
        </div>
    </Transition>
);

VideoPlaylist.PropTypes = {
    videos: PropTypes.array.isRequired,
    isShow: PropTypes.bool.isRequired,
    clickPlaylistItem: PropTypes.func.isRequired,
    togglePlaylistAction: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    videos: state.video_playlist.items,
    isShow: state.video_playlist.isShow
})

export default connect(
    mapStateToProps,
    {
        clickPlaylistItem,
        togglePlaylistAction
    }
)(VideoPlaylist);
