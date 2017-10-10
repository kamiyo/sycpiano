import { VIDEO_ACTIONS } from '@/js/components/Media/Videos/actions.js';

export const videoPlayerReducer = (state = {
    isPlayerReady: false,
    videoId: '',
    shouldPlay: false,
    isPreviewOverlay: false,
}, action) => {
    switch (action.type) {
        case VIDEO_ACTIONS.PLAYER_IS_READY:
            return {
                ...state,
                isPlayerReady: true,
                isPreviewOverlay: true
            }
        case VIDEO_ACTIONS.PLAY_ITEM:
            return {
                ...state,
                videoId: (action.videoId) ? action.videoId : state.videoId,
                shouldPlay: true,
                isPreviewOverlay: false
            }
        case VIDEO_ACTIONS.FETCH_PLAYLIST_SUCCESS:
            return {
                ...state,
                videoId: action.videoId
            }
        case VIDEO_ACTIONS.RESET_PLAYER:
            return {
                ...state,
                isPlayerReady: false,
                videoId: '',
                shouldPlay: false,
                isPreviewOverlay: false
            }
        case VIDEO_ACTIONS.HIDE_PREVIEW_OVERLAY:
            return {
                ...state,
                isPreviewOverlay: false
            }
        default: return state;
    }
};

export const videoPlaylistReducer = (state = {
    items: [],
    isFetching: false,
    isShow: false
}, action) => {
    switch (action.type) {
        case VIDEO_ACTIONS.FETCH_PLAYLIST_REQUEST:
            return {
                ...state, isFetching: true
            }
        case VIDEO_ACTIONS.FETCH_PLAYLIST_SUCCESS:
            return {
                ...state,
                isFetching: false,
                items: action.videos,
                isShow: true
            }
        case VIDEO_ACTIONS.TOGGLE_PLAYLIST:
            return {
                ...state,
                isShow: action.isShow
            }
        default: return state;
    };
};