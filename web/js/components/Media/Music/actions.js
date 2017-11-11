import axios from 'axios';

export const AUDIO_ACTIONS = {
    STORE_RADII: 'AUDIO_ACTIONS--STORE_RADII',
    IS_HOVER_SEEKRING: 'AUDIO_ACTIONS--IS_HOVER_SEEKRING',
    IS_HOVER_PLAYPAUSE: 'AUDIO_ACTIONS--IS_HOVER_PLAYPAUSE',
    IS_MOUSE_MOVE: 'AUDIO_ACTIONS--IS_MOUSE_MOVE',
    FETCH_PLAYLIST_REQUEST: 'AUDIO_ACTIONS--FETCH_PLAYLIST_REQUEST',
    FETCH_PLAYLIST_SUCCESS: 'AUDIO_ACTIONS--FETCH_PLAYLIST_SUCCESS',
    FETCH_PLAYLIST_ERROR: 'AUDIO_ACTIONS--FETCH_PLAYLIST_ERROR',
};

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
        angle: angle ? angle : 0,
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

const fetchPlaylistSuccess = (items) => ({
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
        dispatch(fetchPlaylistSuccess(response.data.items));
    } catch (err) {
        console.log('fetch music error', err);
        dispatch(fetchPlaylistError());
    }
}

export const fetchPlaylistAction = (track) => async (dispatch, getState) => {
    if (shouldFetchPlaylist(getState())) {
        await dispatch(fetchPlaylist());
    }
    const items = getState().audio_playlist.items;
    let firstTrack = items[0];
    if (track) {
        firstTrack = getState().audio_playlist.items.find((item) => {
            return track === item.id;
        });
    }
    return firstTrack;
}