import { loadFIRFile } from '@/js/components/Media/Music/VisualizationUtils.js';

export const AUDIO_ACTIONS = {
    STORE_ANALYZERS: 'AUDIO_ACTIONS--STORE_ANALYZERS',
    UPDATE_POSITION: 'AUDIO_ACTIONS--UPDATE_POSITION',
    SET_IS_PLAYING: 'AUDIO_ACTIONS--SET_IS_PLAYING',
    STORE_ANIMATION_REQUEST_ID: 'AUDIO_ACTIONS--STORE_ANIMATION_REQUEST_ID',
    STORE_DURATION: 'AUDIO_ACTIONS--STORE_DURATION',
    STORE_WAVEFORM_LOADER: 'AUDIO_ACTIONS--STORE_WAVEFORM_LOADER',
    STORE_RADII: 'AUDIO_ACTIONS--STORE_RADII',
    IS_HOVER: 'AUDIO_ACTIONS--IS_HOVER'
};

export const storeWaveformLoader = (waveformLoader) => (dispatch) => (
    dispatch({
        type: AUDIO_ACTIONS.STORE_WAVEFORM_LOADER,
        waveformLoader: waveformLoader
    })
)

export const storeAnalyzers = (analyzers) => (dispatch) => (
    dispatch({
        type: AUDIO_ACTIONS.STORE_ANALYZERS,
        analyzers: analyzers
    })
);

export const updatePlaybackPosition = (position, timestamp) => (dispatch) => (
    dispatch({
        type: AUDIO_ACTIONS.UPDATE_POSITION,
        currentPosition: position,
        updateTimestamp: timestamp
    })
);

export const setIsPlaying = (isPlaying, track) => (dispatch) => (
    dispatch({
        type: AUDIO_ACTIONS.SET_IS_PLAYING,
        isPlaying: isPlaying,
        track: track
    })
)

export const togglePlaying = () => (dispatch, getState) => (
    dispatch({
        type: AUDIO_ACTIONS.SET_IS_PLAYING,
        isPlaying: !getState().audio_player.isPlaying,
        track: null
    })
)

export const storeAnimationRequestId = (requestId) => (dispatch) => (
    dispatch({
        type: AUDIO_ACTIONS.STORE_ANIMATION_REQUEST_ID,
        animationRequestId: requestId
    })
);

export const storeDuration = (duration) => (dispatch) => (
    dispatch({
        type: AUDIO_ACTIONS.STORE_DURATION,
        duration: duration
    })
);

export const storeRadii = (innerRadius, outerRadius) => (dispatch) => (
    dispatch({
        type: AUDIO_ACTIONS.STORE_RADII,
        innerRadius: innerRadius,
        outerRadius: outerRadius
    })
);

export const isHover = (isHover, angle) => (dispatch) => (
    dispatch({
        type: AUDIO_ACTIONS.IS_HOVER,
        isHover: isHover,
        angle: angle
    })
);