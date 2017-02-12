import { combineReducers, createStore } from 'redux';
import { dateReducer, eventItemsReducer } from '@/js/components/Schedule/reducers.js';

const reducersMap = {
    schedule_date: dateReducer,
    schedule_eventItems: eventItemsReducer,
}

export default () => createStore(combineReducers(reducersMap));
