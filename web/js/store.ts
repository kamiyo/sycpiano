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

import { audioPlaylistReducer, audioUIReducer, audioVisualizerReducer } from 'js/components/Media/Music/reducers';
import { videoPlayerReducer, videoPlaylistReducer } from 'js/components/Media/Videos/reducers';
import { acclaimsListReducer } from 'js/components/Press/reducers';
import { eventItemsReducer } from 'js/components/Schedule/reducers';
import { GlobalStateShape } from 'js/types';

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
