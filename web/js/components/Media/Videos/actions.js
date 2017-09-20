export const VIDEO_ACTIONS = {
    FETCH_PLAYLIST_SUCCESS: 'VIDEO--FETCH_PLAYLIST_SUCCESS',
    FETCH_PLAYLIST_REQUEST: 'VIDEO--FETCH_PLAYLIST_REQUEST',
    PLAYER_IS_READY: 'VIDEO--PLAYER_IS_READY',
    PLAY_ITEM: 'VIDEO--PLAY_ITEM',
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

export const playItem = (videoId = null) => (dispatch) => (
    dispatch({
        type: VIDEO_ACTIONS.PLAY_ITEM,
        videoId: videoId
    })
);