import '@/less/Media/Videos/video-playlist.less';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Transition } from 'react-transition-group';
import { TweenLite } from 'gsap';
import VideoPlaylistItem from '@/js/components/Media/Videos/VideoPlaylistItem.jsx';
import VideoPlaylistToggler from '@/js/components/Media/PlaylistToggler.jsx';
import { playVideo, togglePlaylistAction } from '@/js/components/Media/Videos/actions.js';

const slideLeft = (element, amount, delay = 0) => {
    TweenLite.fromTo(element, 0.4, { x: amount }, { x: 0, ease: "Power3.easeOut", delay: delay });
}

const slideRight = (element, amount, delay = 0) => {
    TweenLite.fromTo(element, 0.4, { x: 0 }, { x: amount, ease: "Power3.easeOut", delay: delay });
}

const VideoPlaylist = (props) => {
    let ulRef = null;
    return (
        <Transition
            in={props.isShow}
            appear={true}
            onEnter={(el, isAppearing) => {
                const amount = ulRef.getBoundingClientRect().width;
                slideLeft(el, amount, (isAppearing) ? 0.25 : 0);
            }}
            onExit={(el) => {
                const amount = ulRef.getBoundingClientRect().width;
                slideRight(el, amount);
            }}
            timeout={400}
        >
            <div className="videoPlaylist">
                <VideoPlaylistToggler
                    isPlaylistVisible={props.isShow}
                    onClick={() => {
                        props.togglePlaylistAction();
                    }}
                />
                <ul ref={(ul) => ulRef = ul}>
                    {props.videos.map((video, i) => {
                        return (
                            <VideoPlaylistItem
                                key={video.id}
                                isActive={props.videoId === video.id}
                                video={video}
                                onClick={(video) => {
                                    props.playVideo(video);
                                }}
                            />
                        )
                    })}
                </ul>
            </div>
        </Transition>
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
