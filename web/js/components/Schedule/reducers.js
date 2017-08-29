import _ from 'lodash';
import moment from 'moment';

import { EventItemsWrapper } from '@/js/components/Schedule/EventItemsWrapper.js';

export const dateReducer = (state = {
    date: moment(),
    eventsFetched: false
}, action) => {
    switch (action.type) {
        case 'SCHEDULE--UPDATE_DATE':
            return { ...state, date: action.date};
        case 'SCHEDULE--PREV_MONTH':
            return { ...state, date: state.date.subtract(1, 'month')};
        case 'SCHEDULE--NEXT_MONTH':
            return { ...state, date: state.date.add(1, 'month')};
        case 'SCHEDULE--FETCH_EVENTS_SUCCESS':
            return { ...state, eventsFetched: true};
        default:
            return state;
    };
};

export const eventItemsReducer = (state = {
    items: [],
    eventItemsWrapper: null,
    isFetching: false,
    hasEventBeenSelected: false,
    currentItem: null,
    isFetchingLatLng: false,
}, action) => {
    switch (action.type) {
        case 'SCHEDULE--FETCH_EVENTS_SUCCESS':
            const wrapper = new EventItemsWrapper(action.fetchedEvents);
            return {
                eventItemsWrapper: wrapper,
                items: wrapper.eventItems,
                isFetching: false,
                // Initially default to the closest upcoming event.
                currentItem: _.find(wrapper.eventItems, item => item.type !== 'month'),
            };
        case 'SCHEDULE--FETCHING_EVENTS':
            return state.isFetching ? state : { ...state, isFetching: true }
        case 'SCHEDULE--LAT_LNG_FETCHING':
            return { ...state, isFetchingLatLng: true };
        case 'SCHEDULE--LAT_LNG_FETCHED':
            return {
                ...state,
                isFetchingLatLng: false,
                currentLatLng: { lat: action.lat, lng: action.lng },
            };
        case 'SCHEDULE--SELECT_EVENT':
            return {
                ...state,
                currentItem: action.eventItem,
                hasEventBeenSelected: true,
                // Reset lat, long every time a new item is selected.
                // The EventDetails component is responsible for setting the
                // currentLatLng state via async dispatch.
                currentLatLng: null,
            };
        default:
            return state;
    };
};
