import SCHEDULE_ACTIONS from 'src/components/Schedule/actionTypeKeys';
import ActionType from 'src/components/Schedule/actionTypes';
import { EventItemsStateShape } from 'src/components/Schedule/types';

export const eventItemsReducer = (state: EventItemsStateShape = {
    items: [],
    currentItem: null,
    currentLatLng: {
        lat: 39.0997,
        lng: -94.5786,
    },
    hasEventBeenSelected: false,
    isFetchingList: false,
    isFetchingLatLng: false,
    isAnimatingScroll: false,
}, action: ActionType) => {
    switch (action.type) {
        case SCHEDULE_ACTIONS.FETCH_EVENTS_SUCCESS:
            return {
                ...state,
                items: action.listItems,
                isFetchingList: false,
                currentItem: action.currentItem,
            };
        case SCHEDULE_ACTIONS.FETCH_EVENTS_REQUEST:
            return {
                ...state,
                isFetchingList: true,
            };
        case SCHEDULE_ACTIONS.FETCH_EVENTS_ERROR:
            return {
                ...state,
                isFetchingList: false,
            };
        case SCHEDULE_ACTIONS.FETCH_LAT_LNG_REQUEST:
            return {
                ...state,
                isFetchingLatLng: true,
            };
        case SCHEDULE_ACTIONS.FETCH_LAT_LNG_ERROR:
            return {
                ...state,
                isFetchingLatLng: false,
            };
        case SCHEDULE_ACTIONS.FETCH_LAT_LNG_SUCCESS:
            return {
                ...state,
                isFetchingLatLng: false,
                currentLatLng: { lat: action.lat, lng: action.lng },
            };
        case SCHEDULE_ACTIONS.SELECT_EVENT:
            return {
                ...state,
                hasEventBeenSelected: true,
                // Reset lat, long every time a new item is selected.
                // The EventDetails component is responsible for setting the
                // currentLatLng state via async dispatch.
                currentItem: action.eventItem,
            };
        case SCHEDULE_ACTIONS.SCROLL_START:
            return {
                ...state,
                isAnimatingScroll: true,
            };
        case SCHEDULE_ACTIONS.SCROLL_FINISH:
            return {
                ...state,
                isAnimatingScroll: false,
            };
        default:
            return state;
    }
};
