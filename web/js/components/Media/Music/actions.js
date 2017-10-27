import axios from 'axios';
import { loadFIRFile } from '@/js/components/Media/Music/VisualizationUtils.js';

export const AUDIO_ACTIONS = {
    STORE_ANALYZERS: 'AUDIO_ACTIONS--STORE_ANALYZERS',
    UPDATE_POSITION: 'AUDIO_ACTIONS--UPDATE_POSITION',
    SET_IS_PLAYING: 'AUDIO_ACTIONS--SET_IS_PLAYING',
    STORE_ANIMATION_REQUEST_ID: 'AUDIO_ACTIONS--STORE_ANIMATION_REQUEST_ID',
    STORE_DURATION: 'AUDIO_ACTIONS--STORE_DURATION',
    STORE_WAVEFORM_LOADER: 'AUDIO_ACTIONS--STORE_WAVEFORM_LOADER',
    STORE_RADII: 'AUDIO_ACTIONS--STORE_RADII',
    IS_HOVER_SEEKRING: 'AUDIO_ACTIONS--IS_HOVER_SEEKRING',
    IS_HOVER_PLAYPAUSE: 'AUDIO_ACTIONS--IS_HOVER_PLAYPAUSE',
    IS_MOUSE_MOVE: 'AUDIO_ACTIONS--IS_MOUSE_MOVE',
    FETCH_PLAYLIST_REQUEST: 'AUDIO_ACTIONS--FETCH_PLAYLIST_REQUEST',
    FETCH_PLAYLIST_SUCCESS: 'AUDIO_ACTIONS--FETCH_PLAYLIST_SUCCESS',
    FETCH_PLAYLIST_ERROR: 'AUDIO_ACTIONS--FETCH_PLAYLIST_ERROR',
    SELECT_TRACK: 'AUDIO_ACTIONS--SELECT_TRACK',
};

export const storeWaveformLoader = (waveformLoader) => (dispatch) => (
    dispatch({
        type: AUDIO_ACTIONS.STORE_WAVEFORM_LOADER,
        waveformLoader: waveformLoader
    })
);

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

export const setIsPlaying = (isPlaying) => (dispatch) => (
    dispatch({
        type: AUDIO_ACTIONS.SET_IS_PLAYING,
        isPlaying: isPlaying,
    })
);

export const togglePlaying = () => (dispatch, getState) => (
    dispatch({
        type: AUDIO_ACTIONS.SET_IS_PLAYING,
        isPlaying: !getState().audio_player.isPlaying,
    })
);

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

export const storeRadii = (innerRadius, outerRadius) => dispatch => (
    dispatch({
        type: AUDIO_ACTIONS.STORE_RADII,
        innerRadius: innerRadius,
        outerRadius: outerRadius
    })
);

export const setHoverSeekring = (isHover, angle) => dispatch => (
    dispatch({
        type: AUDIO_ACTIONS.IS_HOVER_SEEKRING,
        isHoverSeekring: isHover,
        angle: angle
    })
);

export const setHoverPlaypause = isHover => dispatch => (
    dispatch({
        type: AUDIO_ACTIONS.IS_HOVER_PLAYPAUSE,
        isHoverPlaypause: isHover
    })
);

export const setMouseMove = isMove => dispatch => (
    dispatch({
        type: AUDIO_ACTIONS.IS_MOUSE_MOVE,
        isMouseMove: isMove
    })
);

const fetchPlaylistRequest = () => ({
    type: AUDIO_ACTIONS.FETCH_PLAYLIST_REQUEST
});

const fetchPlaylistSuccess = (items, firstTrack) => ({
    type: AUDIO_ACTIONS.FETCH_PLAYLIST_SUCCESS,
    items: items,
});

const fetchPlaylistError = () => ({
    type: AUDIO_ACTIONS.FETCH_PLAYLIST_ERROR
})

const shouldFetchPlaylist = (state) => {
    return !state.audio_playlist.isFetching && state.audio_playlist.items.length === 0
}

const fetchPlaylist = () => async (dispatch) => {
    try {
        dispatch(fetchPlaylistRequest());
        const response = await axios.get('/api/music');
        const firstTrack = response.data.items[0];
        dispatch(fetchPlaylistSuccess(response.data.items));
        return firstTrack;
    } catch (err) {
        console.log('fetch music error', err);
        dispatch(fetchPlaylistError());
    }
}

export const fetchPlaylistAction = () => (dispatch, getState) => {
    if (shouldFetchPlaylist(getState())) {
        return dispatch(fetchPlaylist());
    } else if (getState().audio_playlist.items.length) {
        return getState().audio_playlist.items[0]
    }
}

export const selectTrack = (track) => (dispatch, getState) => (
    dispatch({
        type: AUDIO_ACTIONS.SELECT_TRACK,
        currentTrack: track
    })
);