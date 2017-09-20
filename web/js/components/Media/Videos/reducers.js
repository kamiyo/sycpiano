import { VIDEO_ACTIONS } from '@/js/components/Media/Videos/actions.js';

export const playerReducer = (state = {
    isPlayerReady: false,
    videoId: '',
    shouldPlay: false,
    isPreviewOverlay: false
}, action) => {
    switch (action.type) {
        case VIDEO_ACTIONS.PLAYER_IS_READY:
            return {
                ...state,
                isPlayerReady: true,
                isPreviewOverlay: true
            };
        case VIDEO_ACTIONS.PLAY_ITEM:
            return {
                ...state,
                videoId: (action.videoId) ? action.videoId : state.videoId,
                shouldPlay: true
            };
        case VIDEO_ACTIONS.FETCH_PLAYLIST_SUCCESS:
            return {
                ...state,
                videoId: action.video[0].id
            }
        default: return state;
    }
};

export const playlistReducer = (state = {
    items: [],
    isFetching: false,
    isPlaylistShow: false
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
                isPlaylistShow: true
            }
        default: return state;
    };
};