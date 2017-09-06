import _ from 'lodash';
import moment from 'moment';

import { SCHEDULE } from '@/js/components/Schedule/actions.js';

export const eventItemsReducer = (state = {
    items: [],
    isFetching: false,
    hasEventBeenSelected: false,
    currentItem: null,
    isFetchingLatLng: false,
}, action) => {
    switch (action.type) {
        case SCHEDULE.FETCH_EVENTS_SUCCESS:
            return {
                ...state,
                items: action.listItems,
                isFetching: false,
                currentItem: action.currentItem
            };
        case SCHEDULE.FETCH_EVENTS_REQUEST:
            return state.isFetching ? state : { ...state, isFetching: true };
        case SCHEDULE.FETCH_LAT_LNG_REQUEST:
            return {
                ...state,
                isFetchingLatLng: true
            };
        case SCHEDULE.FETCH_LAT_LNG_SUCCESS:
            return {
                ...state,
                isFetchingLatLng: false,
                currentLatLng: { lat: action.lat, lng: action.lng },
            };
        case SCHEDULE.SELECT_EVENT:
            return {
                ...state,
                hasEventBeenSelected: true,
                // Reset lat, long every time a new item is selected.
                // The EventDetails component is responsible for setting the
                // currentLatLng state via async dispatch.
                currentLatLng: null,
                currentItem: action.eventItem,
            };
        default:
            return state;
    };
};
