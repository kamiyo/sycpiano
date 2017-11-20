import { transformGCalEventsToListItems } from 'js/components/Schedule/utils.js';
import { googleAPI } from 'js/services/GoogleAPI.js';
import moment from 'moment-timezone';

export const SCHEDULE_ACTIONS = {
    FETCH_EVENTS_SUCCESS: 'SCHEDULE--FETCH_EVENTS_SUCCESS',
    FETCH_EVENTS_REQUEST: 'SCHEDULE--FETCH_EVENTS_REQUEST',
    FETCH_EVENTS_ERROR: 'SCHEDULE--FETCH_EVENTS_ERROR',
    FETCH_LAT_LNG_REQUEST: 'SCHEDULE--FETCH_LAT_LNG_REQUEST',
    FETCH_LAT_LNG_SUCCESS: 'SCHEDULE--FETCH_LAT_LNG_SUCCESS',
    FETCH_LAT_LNG_ERROR: 'SCHEDULE--FETCH_LAT_LNG_ERROR',
    SELECT_EVENT: 'SCHEDULE--SELECT_EVENT',
    SCROLL_START: 'SCHEDULE--SCROLL_START',
    SCROLL_FINISH: 'SCHEDULE--SCROLL_FINISH'
};

const fetchEventsRequest = () => ({
    type: SCHEDULE_ACTIONS.FETCH_EVENTS_REQUEST
});

const fetchEventsError = () => ({
    type: SCHEDULE_ACTIONS.FETCH_EVENTS_ERROR
});

const fetchEventsSuccess = (listItems, currentItem) => ({
    type: SCHEDULE_ACTIONS.FETCH_EVENTS_SUCCESS,
    listItems: listItems,
    // Initially default to the closest upcoming event.
    currentItem: currentItem
});

const shouldFetchEvents = (state) => {
    const eventItemsReducer = state.schedule_eventItems;
    // should not call api if have items or isFetching
    // will update if we need to add functionality to get more events
    return (eventItemsReducer.items.length === 0 && !eventItemsReducer.isFetching);
}

const fetchEvents = (initialEventDateString) => async (dispatch) => {
    try {
        dispatch(fetchEventsRequest());
        const calendarResponse = await googleAPI.getCalendarEvents();
        const listItems = transformGCalEventsToListItems(calendarResponse.data.items);
        const currentItem = listItems.find(
            item => item.type !== 'month'
                && moment(initialEventDateString).isSame(item.dateTime, 'day')
        ) || listItems.find(item => item.type !== 'month');
        return dispatch(fetchEventsSuccess(listItems, currentItem));
    } catch (err) {
        dispatch(fetchEventsError());
        console.log('fetch events error', err);
    }
}

export const createFetchEventsAction = (initialEventDateString) => (dispatch, getState) => {
    if (shouldFetchEvents(getState())) {
        // need to fetch items
        dispatch(fetchEvents(initialEventDateString));
    }
}

const fetchLatLngRequest = () => ({
    type: SCHEDULE_ACTIONS.FETCH_LAT_LNG_REQUEST
});

const fetchLatLngError = () => ({
    type: SCHEDULE_ACTIONS.FETCH_LAT_LNG_ERROR
});

const fetchLatLngSuccess = (match) => ({
    type: SCHEDULE_ACTIONS.FETCH_LAT_LNG_SUCCESS,
    ...match.geometry.location
});

const shouldFetchLatLng = (state) => {
    const eventItemsReducer = state.schedule_eventItems;
    return !eventItemsReducer.isFetchingLatLng;
}

const fetchLatLng = (location) => async (dispatch) => {
    try {
        dispatch(fetchLatLngRequest());
        const geocodeResponse = await googleAPI.geocode(location);
        const firstMatch = geocodeResponse.data.results[0];
        return dispatch(fetchLatLngSuccess(firstMatch));
    } catch (err) {
        dispatch(fetchLatLngError());
        console.log('failed to fetch geocode', err);
    }
}

export const createFetchLatLngAction = (location) => (dispatch, getState) => {
    if (shouldFetchLatLng(getState())) {
        dispatch(fetchLatLng(location));
    }
}

export const dispatchSelectEvent = (eventItem) => (dispatch) => (
    dispatch({
        type: SCHEDULE_ACTIONS.SELECT_EVENT,
        eventItem: eventItem
    })
);

export const dispatchAnimateStart = () => (dispatch) => (
    dispatch({
        type: SCHEDULE_ACTIONS.SCROLL_START
    })
);

export const dispatchAnimateFinish = () => (dispatch) => (
    dispatch({
        type: SCHEDULE_ACTIONS.SCROLL_FINISH
    })
);