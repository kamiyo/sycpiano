import VIDEO_ACTIONS from 'src/components/Media/Videos/actionTypeKeys';
import ActionTypes from 'src/components/Media/Videos/actionTypes';

import { VideoPlayerStateShape, VideoPlaylistStateShape } from 'src/components/Media/Videos/types';

export const videoPlayerReducer = (state: VideoPlayerStateShape = {
    isPlayerReady: false,
    videoId: '',
    isPreviewOverlay: false,
    isPlaying: false,
}, action: ActionTypes) => {
    switch (action.type) {
        case VIDEO_ACTIONS.PLAYER_IS_READY:
            return {
                ...state,
                isPlayerReady: true,
                isPreviewOverlay: true,
            };
        case VIDEO_ACTIONS.PLAY_ITEM:
            return {
                ...state,
                videoId: action.videoId,
                isPlaying: true,
                isPreviewOverlay: false,
            };
        case VIDEO_ACTIONS.FETCH_PLAYLIST_SUCCESS:
            return {
                ...state,
                videoId: action.videoId,
            };
        case VIDEO_ACTIONS.RESET_PLAYER:
            return {
                ...state,
                isPlayerReady: false,
                videoId: '',
                isPlaying: false,
                isPreviewOverlay: false,
            };
        default: return state;
    }
};

export const videoPlaylistReducer = (state: VideoPlaylistStateShape = {
    items: [],
    isFetching: false,
    isShow: false,
}, action: ActionTypes) => {
    switch (action.type) {
        case VIDEO_ACTIONS.FETCH_PLAYLIST_REQUEST:
            return {
                ...state, isFetching: true,
            };
        case VIDEO_ACTIONS.FETCH_PLAYLIST_SUCCESS:
            return {
                ...state,
                isFetching: false,
                items: action.videos,
                isShow: true,
            };
        case VIDEO_ACTIONS.FETCH_PLAYLIST_ERROR:
            return {
                ...state,
                isFetching: false,
            };
        case VIDEO_ACTIONS.TOGGLE_PLAYLIST:
            return {
                ...state,
                isShow: action.isShow,
            };
        default: return state;
    }
};
