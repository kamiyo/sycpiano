import AUDIO_ACTIONS from 'src/components/Media/Music/actionTypeKeys';
import ActionTypes from 'src/components/Media/Music/actionTypes';
import { AudioPlaylistStateShape, AudioUIStateShape } from 'src/components/Media/Music/types';

export const audioUIReducer = (state: AudioUIStateShape = {
    isHoverSeekring: false,
    isMouseMove: false,
    angle: 0,
    radii: {
        inner: 0,
        outer: 0,
        base: 0,
    },
}, action: ActionTypes) => {
    switch (action.type) {
        case AUDIO_ACTIONS.IS_HOVER_SEEKRING:
            return {
                ...state,
                isHoverSeekring: action.isHoverSeekring,
                angle: action.angle,
            };
        case AUDIO_ACTIONS.IS_MOUSE_MOVE:
            return {
                ...state,
                isMouseMove: action.isMouseMove,
            };
        case AUDIO_ACTIONS.STORE_RADII:
            return {
                ...state,
                radii: action.radii,
            };
        default: return state;
    }
};

export const audioPlaylistReducer = (state: AudioPlaylistStateShape = {
    isFetching: false,
    items: [],
    flatItems: [],
}, action: ActionTypes) => {
    switch (action.type) {
        case AUDIO_ACTIONS.FETCH_PLAYLIST_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case AUDIO_ACTIONS.FETCH_PLAYLIST_ERROR:
            return {
                ...state,
                isFetching: false,
            };
        case AUDIO_ACTIONS.FETCH_PLAYLIST_SUCCESS:
            return {
                ...state,
                isFetching: false,
                items: action.items,
                flatItems: action.flatItems,
            };
        default: return state;
    }
};
