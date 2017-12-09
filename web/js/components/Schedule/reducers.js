import { SCHEDULE_ACTIONS } from '@/js/components/Schedule/actions.js';

export const eventItemsReducer = (state = {
    items: [],
    isFetching: false,
    hasEventBeenSelected: false,
    currentItem: null,
    isFetchingLatLng: false,
    isAnimatingScroll: false
}, action) => {
    switch (action.type) {
        case SCHEDULE_ACTIONS.FETCH_EVENTS_SUCCESS:
            return {
                ...state,
                items: action.listItems,
                isFetching: false,
                currentItem: action.currentItem
            };
        case SCHEDULE_ACTIONS.FETCH_EVENTS_REQUEST:
            return { ...state, isFetching: true };
        case SCHEDULE_ACTIONS.FETCH_EVENTS_ERROR:
            return { ...state, isFetching: false };
        case SCHEDULE_ACTIONS.FETCH_LAT_LNG_REQUEST:
            return { ...state, isFetchingLatLng: true };
        case SCHEDULE_ACTIONS.FETCH_LAT_LNG_ERROR:
            return { ...state, isFetchingLatLng: false };
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
                currentLatLng: null,
                currentItem: action.eventItem,
            };
        case SCHEDULE_ACTIONS.SCROLL_START:
            return {
                ...state,
                isAnimatingScroll: true
            };
        case SCHEDULE_ACTIONS.SCROLL_FINISH:
            return {
                ...state,
                isAnimatingScroll: false
            }
        default:
            return state;
    };
};
