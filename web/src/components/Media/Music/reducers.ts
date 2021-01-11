import { Reducer } from 'redux';
import AUDIO_ACTIONS from 'src/components/Media/Music/actionTypeKeys';
import { ActionTypes } from 'src/components/Media/Music/actionTypes';
import { AudioPlaylistStateShape } from 'src/components/Media/Music/types';

export const audioPlaylistReducer: Reducer<AudioPlaylistStateShape, ActionTypes> = (state: AudioPlaylistStateShape = {
    isFetching: false,
    items: [],
    flatItems: [],
}, action: ActionTypes) => {
    switch (action.type) {
        case AUDIO_ACTIONS.FETCH_PLAYLIST_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case AUDIO_ACTIONS.FETCH_PLAYLIST_ERROR:
            return {
                ...state,
                isFetching: false,
            };
        case AUDIO_ACTIONS.FETCH_PLAYLIST_SUCCESS:
            return {
                ...state,
                isFetching: false,
                items: action.items,
                flatItems: action.flatItems,
            };
        default: return state;
    }
};
