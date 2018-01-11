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

import { audioPlaylistReducer, audioUIReducer, audioVisualizerReducer } from 'src/components/Media/Music/reducers';
import { photoListReducer, photoViewerReducer } from 'src/components/Media/Photos/reducers';
import { videoPlayerReducer, videoPlaylistReducer } from 'src/components/Media/Videos/reducers';
import { acclaimsListReducer } from 'src/components/Press/reducers';
import { scheduleReducer } from 'src/components/Schedule/reducers';
import { GlobalStateShape } from 'src/types';

const reducersMap = {
    audio_playlist: audioPlaylistReducer,
    audio_ui: audioUIReducer,
    audio_visualizer: audioVisualizerReducer,
    photo_list: photoListReducer,
    photo_viewer: photoViewerReducer,
    press_acclaimsList: acclaimsListReducer,
    schedule_eventItems: scheduleReducer,
    video_player: videoPlayerReducer,
    video_playlist: videoPlaylistReducer,
};

export default () => createStore(combineReducers<GlobalStateShape>(reducersMap), applyMiddleware(thunk));
