import { combineReducers, createStore } from 'redux';
import { acclaimsListReducer } from '@/js/components/Press/reducers.js';
import { dateReducer, eventItemsReducer } from '@/js/components/Schedule/reducers.js';

const reducersMap = {
    schedule_date: dateReducer,
    schedule_eventItems: eventItemsReducer,
    press_acclaimsList: acclaimsListReducer,
};

export default () => createStore(combineReducers(reducersMap));
