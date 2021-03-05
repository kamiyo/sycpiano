import axios from 'axios';

import compact from 'lodash-es/compact';
import { ThunkAction } from 'redux-thunk';

import AUDIO_ACTIONS from 'src/components/Media/Music/actionTypeKeys';
import * as ActionTypes from 'src/components/Media/Music/actionTypes';
import { isMusicItem, MusicCategories, MusicFileItem, MusicItem, MusicListItem, MusicResponse } from 'src/components/Media/Music/types';
import { getLastName, normalizeString } from 'src/components/Media/Music/utils';
import { GlobalStateShape } from 'src/types';

const fetchPlaylistRequest = (): ActionTypes.FetchPlaylistRequest => ({
    type: AUDIO_ACTIONS.FETCH_PLAYLIST_REQUEST,
});

const fetchPlaylistSuccess = (items: MusicListItem[], flatItems: MusicFileItem[]): ActionTypes.FetchPlaylistSuccess => ({
    type: AUDIO_ACTIONS.FETCH_PLAYLIST_SUCCESS,
    items,
    flatItems,
});

const fetchPlaylistError = (): ActionTypes.FetchPlaylistError => ({
    type: AUDIO_ACTIONS.FETCH_PLAYLIST_ERROR,
});

const shouldFetchPlaylist = (state: GlobalStateShape) => {
    return !state.audioPlaylist.isFetching && state.audioPlaylist.items.length === 0;
};

const musicListIfExists = (response: MusicResponse, category: MusicCategories) => (
    response[category].length ? [
        { type: category, id: category },
        ...(response[category]),
    ] : []
);

type FetchPlaylistActions = ActionTypes.FetchPlaylistError | ActionTypes.FetchPlaylistRequest | ActionTypes.FetchPlaylistSuccess;

const fetchPlaylist = (): ThunkAction<Promise<MusicListItem[]>, GlobalStateShape, void, FetchPlaylistActions> => async (dispatch) => {
    try {
        dispatch(fetchPlaylistRequest());
        const { data: response }: { data: MusicResponse } = await axios.get('/api/music');
        const flatItems: MusicFileItem[] = [];
        Object.keys(response).forEach((currKey: MusicCategories) => {
            response[currKey].forEach((_, idx) => {
                response[currKey][idx].musicFiles.forEach((__, idy) => {
                    response[currKey][idx].musicFiles[idy] = {
                        ...response[currKey][idx].musicFiles[idy],
                        musicItem: response[currKey][idx],
                    };
                    flatItems.push(response[currKey][idx].musicFiles[idy]);
                });
            });
        });
        response.concerto.push({
            composer: 'For more recordings of concerti, please contact Sean Chen directly',
            piece: '',
            id: 'more_concerti',
            musicFiles: [],
        } as MusicItem);
        const items: MusicListItem[] = compact([
            ...musicListIfExists(response, 'solo'),
            ...musicListIfExists(response, 'concerto'),
            ...musicListIfExists(response, 'chamber'),
            ...musicListIfExists(response, 'composition'),
            ...musicListIfExists(response, 'videogame'),
        ]);
        dispatch(fetchPlaylistSuccess(items, flatItems));
        return items;
    } catch (err) {
        console.log('fetch music error', err);
        dispatch(fetchPlaylistError());
    }
};

export const fetchPlaylistAction = (composer: string, piece: string, movement = ''): ThunkAction<Promise<MusicFileItem>, GlobalStateShape, void, FetchPlaylistActions> =>
    async (dispatch, getState) => {
        let items: MusicListItem[];
        if (shouldFetchPlaylist(getState())) {
            items = await dispatch(fetchPlaylist());
        } else {
            items = getState().audioPlaylist.items;
        }
        let firstTrack = (items.find((item) => isMusicItem(item)) as MusicItem).musicFiles[0];

        if (composer && piece) {
            firstTrack = items.reduce((prev, item) => {
                if (isMusicItem(item) && getLastName(item.composer) === composer && normalizeString(item.piece) === piece) {
                    return prev.concat(
                        item.musicFiles.length === 1
                            ? item.musicFiles
                            : item.musicFiles.filter((musicFile) => (
                                normalizeString(musicFile.name) === movement
                            )));
                } else {
                    return prev;
                }
            }, [])[0];
        }
        return firstTrack;
    };
