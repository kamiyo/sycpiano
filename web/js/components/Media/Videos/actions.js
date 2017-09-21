export const VIDEO_ACTIONS = {
    FETCH_PLAYLIST_SUCCESS: 'VIDEO--FETCH_PLAYLIST_SUCCESS',
    FETCH_PLAYLIST_REQUEST: 'VIDEO--FETCH_PLAYLIST_REQUEST',
    PLAYER_IS_READY: 'VIDEO--PLAYER_IS_READY',
    PLAY_ITEM: 'VIDEO--PLAY_ITEM',
    TOGGLE_PLAYLIST: 'VIDEO--TOGGLE_PLAYLIST',
    HIDE_PREVIEW_OVERLAY: 'VIDEO--HIDE_PREVIEW_OVERLAY',
    RESET_PLAYER: 'VIDEO--RESET_PLAYER'
};

const fetchPlaylistRequest = () => ({
    type: VIDEO_ACTIONS.FETCH_PLAYLIST_REQUEST
});

const fetchPlaylistSuccess = (videos) => ({
    type: VIDEO_ACTIONS.FETCH_PLAYLIST_SUCCESS,
    videos: videos
});

const fetchPlaylist = (fetchingFunction) => (dispatch) => {
    dispatch(fetchPlaylistRequest());
    return fetchingFunction().then(response => {
        const videos = response.data.items;
        return dispatch(fetchPlaylistSuccess(videos));
    }).catch(response => {
        console.error(`get videos request failed: ${response}`);
    });
}

const shouldFetchPlaylist = (state) => {
    const playlistReducer = state.video_playlist;
    return (playlistReducer.items.length === 0 && !playlistReducer.isFetching);
}

export const createFetchPlaylistAction = (fetchingFunction) => (dispatch, getState) => {
    if (shouldFetchPlaylist(getState())) {
        return dispatch(fetchPlaylist(fetchingFunction));
    } else {
        return Promise.resolve();
    }
}

export const playerIsReady = () => (dispatch) => (
    dispatch({
        type: VIDEO_ACTIONS.PLAYER_IS_READY
    })
)

const playItem = (videoId = null) => ({
    type: VIDEO_ACTIONS.PLAY_ITEM,
    videoId: videoId
});

// Not used right now...
// export const playItemAction = (videoId = null) => (dispatch) => (
//     dispatch(playItem(videoId))
// );

const togglePlaylist = (show, state) => {
    const show = (show === null) ? !state.video_playlist.isShow : show;
    return {
        type: VIDEO_ACTIONS.TOGGLE_PLAYLIST,
        isShow: show
    };
}

export const togglePlaylistAction = (show = null) => (dispatch, getState) => (
    dispatch(togglePlaylist(show, getState()))
);

export const clickPlaylistItem = (videoId) => (dispatch, getState) => {
    const videoPlayerReducer = getState().video_player;
    if (videoPlayerReducer.shouldPlay && videoId === videoPlayerReducer.videoId)
        return;
    setTimeout(() => dispatch(togglePlaylist(false, getState())), 250);
    return dispatch(playItem(videoId));
}

export const hidePreviewOverlay = () => (dispatch) => {
    dispatch({
        type: VIDEO_ACTIONS.HIDE_PREVIEW_OVERLAY
    });
    dispatch(playItem());
}

export const resetPlayer = () => (dispatch) => (
    dispatch({
        type: VIDEO_ACTIONS.RESET_PLAYER
    })
);