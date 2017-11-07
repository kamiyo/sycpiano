import { AUDIO_ACTIONS } from '@/js/components/Media/Music/actions.js';
import { WaveformLoader } from '@/js/components/Media/Music/VisualizationUtils.js';

export const audioVisualizerReducer = (state = {
    isHover: false
}, action) => {
    switch(action.type) {
        case AUDIO_ACTIONS.STORE_RADII:
            return {
                ...state,
                innerRadius: action.innerRadius,
                outerRadius: action.outerRadius
            }
        case AUDIO_ACTIONS.IS_HOVER:
            return {
                ...state,
                isHover: action.isHover
            }
        default: return state;
    }
};

export const audioUIReducer = (state = {
    isHoverSeekring: false,
    isHoverPlaypause: false,
    isMouseMove: false,
    angle: null
}, action) => {
    switch(action.type) {
        case AUDIO_ACTIONS.IS_HOVER_SEEKRING:
            return {
                ...state,
                isHoverSeekring: action.isHoverSeekring,
                angle: action.angle
            }
        case AUDIO_ACTIONS.IS_HOVER_PLAYPAUSE:
            return {
                ...state,
                isHoverPlaypause: action.isHoverPlaypause
            }
        case AUDIO_ACTIONS.IS_MOUSE_MOVE:
            return {
                ...state,
                isMouseMove: action.isMouseMove
            }
        default: return state;
    }
};

export const audioPlaylistReducer = (state = {
    isFetching: false,
    items: [],
}, action) => {
    switch (action.type) {
        case AUDIO_ACTIONS.FETCH_PLAYLIST_REQUEST:
            return {
                ...state,
                isFetching: true
            }
        case AUDIO_ACTIONS.FETCH_PLAYLIST_ERROR:
            return {
                ...state,
                isFetching: false
            }
        case AUDIO_ACTIONS.FETCH_PLAYLIST_SUCCESS:
            return {
                ...state,
                isFetching: false,
                items: action.items,
            }
        default: return state;
    }
}