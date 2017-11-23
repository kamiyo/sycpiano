import SCHEDULE_ACTIONS from 'js/components/Schedule/actionTypeKeys';
import ActionType from 'js/components/Schedule/actionTypes';

export interface EventItemsStateShape {
    items: any[];
    currentItem: any;
    currentLatLng: {
        lat: number;
        lng: number;
    };
    hasEventBeenSelected: boolean;
    isFetching: boolean;
    isFetchingLatLng: boolean;
    isAnimatingScroll: boolean;
}

export const eventItemsReducer = (state: EventItemsStateShape = {
    items: [],
    currentItem: null,
    currentLatLng: null,
    hasEventBeenSelected: false,
    isFetching: false,
    isFetchingLatLng: false,
    isAnimatingScroll: false,
}, action: ActionType) => {
    switch (action.type) {
        case SCHEDULE_ACTIONS.FETCH_EVENTS_SUCCESS:
            return {
                ...state,
                items: action.listItems,
                isFetching: false,
                currentItem: action.currentItem,
            };
        case SCHEDULE_ACTIONS.FETCH_EVENTS_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case SCHEDULE_ACTIONS.FETCH_EVENTS_ERROR:
            return {
                ...state,
                isFetching: false,
            };
        case SCHEDULE_ACTIONS.FETCH_LAT_LNG_REQUEST:
            return {
                ...state,
                isFetchingLatLng: true,
                currentLatLng: null,
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
                currentLatLng: null,
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
