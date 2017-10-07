import { AUDIO_ACTIONS } from '@/js/components/Media/Music/actions.js';
import { WaveformLoader } from '@/js/components/Media/Music/VisualizationUtils.js';

export const audioPlayerReducer = (state = {
    waveformLoader: new WaveformLoader(),
    currentPosition: 0,
    currentTrack: {},
    isPlaying: false,
    analyzers: [],
    updateTimestamp: null,
    duration: null
}, action) => {
    switch(action.type) {
        case AUDIO_ACTIONS.UPDATE_POSITION:
            return {
                ...state,
                currentPosition: action.currentPosition,
                updateTimestamp: action.updateTimestamp
            }
        case AUDIO_ACTIONS.STORE_ANALYZERS:
            return {
                ...state,
                analyzers: action.analyzers
            }
        case AUDIO_ACTIONS.STORE_DURATION:
            return {
                ...state,
                duration: action.duration
            }
        case AUDIO_ACTIONS.SET_IS_PLAYING:
            return {
                ...state,
                isPlaying: action.isPlaying,
                currentTrack: (action.track) ? action.track : state.currentTrack
            }
        case AUDIO_ACTIONS.STORE_WAVEFORM_LOADER:
            return {
                ...state,
                waveformLoader: action.waveformLoader
            }
        default: return state;
    }
};

export const audioVisualizerReducer = (state = {
    isHover: false
}, action) => {
    switch(action.type) {
        case AUDIO_ACTIONS.STORE_ANIMATION_REQUEST_ID:
            return {
                ...state,
                animationRequestId: action.animationRequestId
            }
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
    isHover: false,
    angle: null
}, action) => {
    switch(action.type) {
        case AUDIO_ACTIONS.IS_HOVER:
            return {
                ...state,
                isHover: action.isHover,
                angle: action.angle
            }
        default: return state;
    }
};