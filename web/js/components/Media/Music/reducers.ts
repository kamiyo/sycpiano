import AUDIO_ACTIONS from 'js/components/Media/Music/actionTypeKeys';
import ActionTypes from 'js/components/Media/Music/actionTypes';
import { AudioPlaylistStateShape, AudioUIStateShape, AudioVisualizerStateShape } from 'js/components/Media/Music/types';

export const audioVisualizerReducer = (state: AudioVisualizerStateShape = {
    innerRadius: 0,
    outerRadius: 0,
}, action: ActionTypes) => {
    switch (action.type) {
        case AUDIO_ACTIONS.STORE_RADII:
            return {
                ...state,
                innerRadius: action.innerRadius,
                outerRadius: action.outerRadius,
            };
        default: return state;
    }
};

export const audioUIReducer = (state: AudioUIStateShape = {
    isHoverSeekring: false,
    isHoverPlaypause: false,
    isMouseMove: false,
    angle: 0,
}, action: ActionTypes) => {
    switch (action.type) {
        case AUDIO_ACTIONS.IS_HOVER_SEEKRING:
            return {
                ...state,
                isHoverSeekring: action.isHoverSeekring,
                angle: action.angle,
            };
        case AUDIO_ACTIONS.IS_HOVER_PLAYPAUSE:
            return {
                ...state,
                isHoverPlaypause: action.isHoverPlaypause,
            };
        case AUDIO_ACTIONS.IS_MOUSE_MOVE:
            return {
                ...state,
                isMouseMove: action.isMouseMove,
            };
        default: return state;
    }
};

export const audioPlaylistReducer = (state: AudioPlaylistStateShape = {
    isFetching: false,
    items: [],
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
            };
        default: return state;
    }
};
