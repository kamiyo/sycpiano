/**
 * This is the global redux store.
 *
 * It takes reducers from different pages, combines them into a single reducer,
 * and creates a combined store.
 *
 * We make sure to namespace the states by their corresponding reducers.
 */

import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import { audioPlaylistReducer, audioUIReducer, audioVisualizerReducer } from 'js/components/Media/Music/reducers.js';
import { videoPlayerReducer, videoPlaylistReducer } from 'js/components/Media/Videos/reducers.js';
import { acclaimsListReducer } from 'js/components/Press/reducers.js';
import { eventItemsReducer, EventItemsStateShape } from 'js/components/Schedule/reducers';

// update as types are filled
export interface GlobalStateShape {
    audio_playlist: any;
    audio_ui: any;
    audio_visualizer: any;
    press_acclaimsList: any;
    schedule_eventItems: EventItemsStateShape;
    video_player: any;
    video_playlist: any;
}

const reducersMap = {
    audio_playlist: audioPlaylistReducer,
    audio_ui: audioUIReducer,
    audio_visualizer: audioVisualizerReducer,
    press_acclaimsList: acclaimsListReducer,
    schedule_eventItems: eventItemsReducer,
    video_player: videoPlayerReducer,
    video_playlist: videoPlaylistReducer,
};

export default () => createStore(combineReducers<GlobalStateShape>(reducersMap), applyMiddleware(thunk));
