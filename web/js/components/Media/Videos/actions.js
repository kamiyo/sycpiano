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
    videos: videos,
    videoId: videos[0].id
});

// need two separate api requests, because statistics is only available when fetching videos
const fetchPlaylist = (fetchPlaylistFunc, fetchVideosFunc) => (dispatch) => {
    dispatch(fetchPlaylistRequest());
    return fetchPlaylistFunc().then(response => {
        const videoItems = response.data.items;
        const videoIds = videoItems.map(item => {
            return item.snippet.resourceId.videoId;
        });
        return fetchVideosFunc(videoIds).then(response => {
            response.data.items.forEach((item, i) => {
                videoItems[i] = {...videoItems[i], ...item};
            });
            return videoItems;
        }).then((videoItems) =>
            setTimeout(() => dispatch(fetchPlaylistSuccess(videoItems)), 500)
        );
    });
}

const shouldFetchPlaylist = (state) => {
    const playlistReducer = state.video_playlist;
    return (playlistReducer.items.length === 0 && !playlistReducer.isFetching);
}

export const createFetchPlaylistAction = (fetchPlaylistFunc, fetchVideosFunc) => (dispatch, getState) => {
    if (shouldFetchPlaylist(getState())) {
        return dispatch(fetchPlaylist(fetchPlaylistFunc, fetchVideosFunc));
    } else {
        dispatch(togglePlaylist(true, getState()));
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

const togglePlaylist = (show, state) => {
    const isShow = (show === null) ? !state.video_playlist.isShow : show;
    return {
        type: VIDEO_ACTIONS.TOGGLE_PLAYLIST,
        isShow: isShow
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