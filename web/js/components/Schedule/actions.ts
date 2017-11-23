import SCHEDULE_ACTIONS from 'js/components/Schedule/actionTypeKeys';
import * as ActionTypes from 'js/components/Schedule/actionTypes';
import { DayItemShape, EventItemShape } from 'js/components/Schedule/types';
import { GlobalStateShape } from 'js/types';

import moment from 'moment-timezone';
import { Dispatch } from 'redux';

import { transformGCalEventsToListItems } from 'js/components/Schedule/utils';
import { googleAPI } from 'js/services/GoogleAPI';

const fetchEventsRequest = (): ActionTypes.FetchEventsRequest => ({
    type: SCHEDULE_ACTIONS.FETCH_EVENTS_REQUEST,
});

const fetchEventsError = (): ActionTypes.FetchEventsError => ({
    type: SCHEDULE_ACTIONS.FETCH_EVENTS_ERROR,
});

const fetchEventsSuccess = (listItems: EventItemShape[], currentItem: EventItemShape): ActionTypes.FetchEventsSuccess => ({
    type: SCHEDULE_ACTIONS.FETCH_EVENTS_SUCCESS,
    listItems,
    // Initially default to the closest upcoming event.
    currentItem,
});

const shouldFetchEvents = (state: GlobalStateShape) => {
    const eventItemsReducer = state.schedule_eventItems;
    // should not call api if have items or isFetching
    // will update if we need to add functionality to get more events
    return (eventItemsReducer.items.length === 0 && !eventItemsReducer.isFetching);
};

const fetchEvents = (initialEventDateString: string) => async (dispatch: Dispatch<GlobalStateShape>) => {
    try {
        dispatch(fetchEventsRequest());
        const calendarResponse = await googleAPI.getCalendarEvents();
        const listItems = transformGCalEventsToListItems(calendarResponse.data.items);
        const currentItem = listItems.find((item) =>
            item.type === 'day'
            && moment(initialEventDateString).isSame((item as DayItemShape).dateTime, 'day'),
        ) || listItems.find((item) => item.type !== 'month');
        dispatch(fetchEventsSuccess(listItems, currentItem));
    } catch (err) {
        dispatch(fetchEventsError());
        console.log('fetch events error', err);
    }
};

export const createFetchEventsAction = (initialEventDateString: string) => (dispatch: Dispatch<GlobalStateShape>, getState: () => GlobalStateShape) => {
    if (shouldFetchEvents(getState())) {
        // need to fetch items
        dispatch(fetchEvents(initialEventDateString));
    }
};

const fetchLatLngRequest = () => ({
    type: SCHEDULE_ACTIONS.FETCH_LAT_LNG_REQUEST,
});

const fetchLatLngError = () => ({
    type: SCHEDULE_ACTIONS.FETCH_LAT_LNG_ERROR,
});

const fetchLatLngSuccess = (match: google.maps.GeocoderResult) => ({
    type: SCHEDULE_ACTIONS.FETCH_LAT_LNG_SUCCESS,
    lat: match.geometry.location.lat,
    lng: match.geometry.location.lng,
});

const shouldFetchLatLng = (state: GlobalStateShape) => {
    const eventItemsReducer = state.schedule_eventItems;
    return !eventItemsReducer.isFetchingLatLng;
};

const fetchLatLng = (location: string) => async (dispatch: Dispatch<GlobalStateShape>) => {
    try {
        dispatch(fetchLatLngRequest());
        const geocodeResponse = await googleAPI.geocode(location);
        const firstMatch: google.maps.GeocoderResult = geocodeResponse.data.results[0];
        return dispatch(fetchLatLngSuccess(firstMatch));
    } catch (err) {
        dispatch(fetchLatLngError());
        console.log('failed to fetch geocode', err);
    }
};

export const createFetchLatLngAction = (location: string) => (dispatch: Dispatch<GlobalStateShape>, getState: () => GlobalStateShape) => {
    if (shouldFetchLatLng(getState())) {
        dispatch(fetchLatLng(location));
    }
};

export const dispatchSelectEvent = (eventItem: EventItemShape) => (dispatch: Dispatch<GlobalStateShape>) => (
    dispatch({
        type: SCHEDULE_ACTIONS.SELECT_EVENT,
        eventItem,
    })
);

export const dispatchAnimateStart = () => (dispatch: Dispatch<GlobalStateShape>) => (
    dispatch({
        type: SCHEDULE_ACTIONS.SCROLL_START,
    })
);

export const dispatchAnimateFinish = () => (dispatch: Dispatch<GlobalStateShape>) => (
    dispatch({
        type: SCHEDULE_ACTIONS.SCROLL_FINISH,
    })
);
