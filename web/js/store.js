/**
 * This is the global redux store.
 *
 * It takes reducers from different pages, combines them into a single reducer,
 * and creates a combined store.
 *
 * We make sure to namespace the states by their corresponding reducers.
 */

import { combineReducers, createStore } from 'redux';
import { acclaimsListReducer } from '@/js/components/Press/reducers.js';
import { eventItemsReducer } from '@/js/components/Schedule/reducers.js';

const reducersMap = {
    schedule_eventItems: eventItemsReducer,
    press_acclaimsList: acclaimsListReducer,
};

export default () => createStore(combineReducers(reducersMap));
