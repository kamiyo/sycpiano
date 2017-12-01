import axios from 'axios';

import { ThunkAction } from 'redux-thunk';

import AUDIO_ACTIONS from 'src/components/Media/Music/actionTypeKeys';
import * as ActionTypes from 'src/components/Media/Music/actionTypes';
import { MusicItem } from 'src/components/Media/Music/types';
import { GlobalStateShape } from 'src/types';

export const storeRadii = (innerRadius: number, outerRadius: number): ThunkAction<void, GlobalStateShape, void> =>
    (dispatch) => dispatch({
        type: AUDIO_ACTIONS.STORE_RADII,
        innerRadius,
        outerRadius,
    } as ActionTypes.StoreRadii);

export const setHoverSeekring = (isHover: boolean, angle: number): ThunkAction<void, GlobalStateShape, void> =>
    (dispatch) => dispatch({
        type: AUDIO_ACTIONS.IS_HOVER_SEEKRING,
        isHoverSeekring: isHover,
        angle: angle ? angle : 0,
    } as ActionTypes.SetHoverSeekring);

export const setHoverPlaypause = (isHover: boolean): ThunkAction<void, GlobalStateShape, void> =>
    (dispatch) => dispatch({
        type: AUDIO_ACTIONS.IS_HOVER_PLAYPAUSE,
        isHoverPlaypause: isHover,
    } as ActionTypes.SetHoverPlaypause);

export const setMouseMove = (isMove: boolean): ThunkAction<void, GlobalStateShape, void> =>
    (dispatch) => dispatch({
        type: AUDIO_ACTIONS.IS_MOUSE_MOVE,
        isMouseMove: isMove,
    } as ActionTypes.SetMouseMove);

const fetchPlaylistRequest = (): ActionTypes.FetchPlaylistRequest => ({
    type: AUDIO_ACTIONS.FETCH_PLAYLIST_REQUEST,
});

const fetchPlaylistSuccess = (items: MusicItem[]): ActionTypes.FetchPlaylistSuccess => ({
    type: AUDIO_ACTIONS.FETCH_PLAYLIST_SUCCESS,
    items,
});

const fetchPlaylistError = (): ActionTypes.FetchPlaylistError => ({
    type: AUDIO_ACTIONS.FETCH_PLAYLIST_ERROR,
});

const shouldFetchPlaylist = (state: GlobalStateShape) => {
    return !state.audio_playlist.isFetching && state.audio_playlist.items.length === 0;
};

const fetchPlaylist = (): ThunkAction<void, GlobalStateShape, void> => async (dispatch) => {
    try {
        dispatch(fetchPlaylistRequest());
        const response = await axios.get('/api/music');
        dispatch(fetchPlaylistSuccess(response.data.items));
    } catch (err) {
        console.log('fetch music error', err);
        dispatch(fetchPlaylistError());
    }
};

export const fetchPlaylistAction = (track: string): ThunkAction<Promise<MusicItem>, GlobalStateShape, void> =>
    async (dispatch, getState) => {
        if (shouldFetchPlaylist(getState())) {
            await dispatch(fetchPlaylist());
        }
        const items = getState().audio_playlist.items;
        let firstTrack = items[0];
        if (track) {
            firstTrack = getState().audio_playlist.items.find((item: MusicItem) => {
                return track === item.id;
            });
        }
        return firstTrack;
    };
