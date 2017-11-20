import youTube from 'js/YouTube.js';

export const VIDEO_ACTIONS = {
    FETCH_PLAYLIST_SUCCESS: 'VIDEO--FETCH_PLAYLIST_SUCCESS',
    FETCH_PLAYLIST_REQUEST: 'VIDEO--FETCH_PLAYLIST_REQUEST',
    FETCH_PLAYLIST_ERROR: 'VIDEO--FETCH_PLAYLIST_ERROR',
    PLAYER_IS_READY: 'VIDEO--PLAYER_IS_READY',
    PLAY_ITEM: 'VIDEO--PLAY_ITEM',
    TOGGLE_PLAYLIST: 'VIDEO--TOGGLE_PLAYLIST',
    RESET_PLAYER: 'VIDEO--RESET_PLAYER'
};

export const initializeYoutubeElement = (el) => (dispatch) => {
    youTube.initializePlayerOnElement(el);
    youTube.executeWhenPlayerReady(() => dispatch({
        type: VIDEO_ACTIONS.PLAYER_IS_READY
    }));
}

const fetchPlaylistRequest = () => ({
    type: VIDEO_ACTIONS.FETCH_PLAYLIST_REQUEST
});

const fetchPlaylistSuccess = (videos) => ({
    type: VIDEO_ACTIONS.FETCH_PLAYLIST_SUCCESS,
    videos: videos,
    videoId: videos[0].id
});

const fetchPlaylistError = () => ({
    type: VIDEO_ACTIONS.FETCH_PLAYLIST_ERROR
})

// need two separate api requests, because statistics is only available when fetching videos
const fetchPlaylist = () => async (dispatch) => {
    try {
        dispatch(fetchPlaylistRequest());
        const playlistResponse = await youTube.getPlaylistItems();
        const videoItems = playlistResponse.data.items;
        const videoIds = videoItems.map(item => {
            return item.snippet.resourceId.videoId;
        });
        const videosResponse = await youTube.getVideos(videoIds);
        await videosResponse.data.items.forEach((item, i) => {
            videoItems[i] = { ...videoItems[i], ...item };
        });
        setTimeout(() => dispatch(fetchPlaylistSuccess(videoItems)), 500);
    } catch (err) {
        dispatch(fetchPlaylistError());
        console.log('fetch videos error', err);
    }
}

const shouldFetchPlaylist = (state) => {
    const playlistReducer = state.video_playlist;
    return (playlistReducer.items.length === 0 && !playlistReducer.isFetching);
}

export const createFetchPlaylistAction = () => (dispatch, getState) => {
    if (shouldFetchPlaylist(getState())) {
        dispatch(fetchPlaylist());
    } else {
        dispatch(togglePlaylist(true, getState()));
    }
}

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

export const playVideo = (videoId) => (dispatch, getState) => {
    const videoPlayerReducer = getState().video_player;
    setTimeout(() => dispatch(togglePlaylist(false, getState())), 500);
    if (videoPlayerReducer.isPlaying && videoId === videoPlayerReducer.videoId)
        return;
    const vid = videoId ? videoId : videoPlayerReducer.videoId;
    youTube.loadVideoById(vid, true);
    dispatch(playItem(vid));
}

export const resetPlayer = () => (dispatch) => {
    youTube.destroyPlayer();
    dispatch({
        type: VIDEO_ACTIONS.RESET_PLAYER
    })
}