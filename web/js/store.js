/**
 * This is the global redux store.
 *
 * It takes reducers from different pages, combines them into a single reducer,
 * and creates a combined store.
 *
 * We make sure to namespace the states by their corresponding reducers.
 */

import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import { acclaimsListReducer } from '@/js/components/Press/reducers.js';
import { eventItemsReducer } from '@/js/components/Schedule/reducers.js';
import { audioPlayerReducer, audioVisualizerReducer, audioUIReducer, audioPlaylistReducer } from '@/js/components/Media/Music/reducers.js';
import { videoPlayerReducer, videoPlaylistReducer } from '@/js/components/Media/Videos/reducers.js';

const reducersMap = {
    schedule_eventItems: eventItemsReducer,
    press_acclaimsList: acclaimsListReducer,
    audio_player: audioPlayerReducer,
    audio_visualizer: audioVisualizerReducer,
    audio_ui: audioUIReducer,
    audio_playlist: audioPlaylistReducer,
    video_player: videoPlayerReducer,
    video_playlist: videoPlaylistReducer
};

export default () => createStore(combineReducers(reducersMap), applyMiddleware(thunk));