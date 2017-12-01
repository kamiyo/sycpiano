import SCHEDULE_ACTIONS from 'src/components/Schedule/actionTypeKeys';
import * as ActionTypes from 'src/components/Schedule/actionTypes';
import { DayItemShape, EventItemShape } from 'src/components/Schedule/types';
import { GlobalStateShape } from 'src/types';

import moment from 'moment-timezone';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { transformGCalEventsToListItems } from 'src/components/Schedule/utils';
import { googleAPI } from 'src/services/GoogleAPI';

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

const fetchEvents = (initialEventDateString: string): ThunkAction<void, GlobalStateShape, void> => async (dispatch) => {
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

export const createFetchEventsAction = (initialEventDateString: string): ThunkAction<void, GlobalStateShape, void> => (dispatch, getState) => {
    if (shouldFetchEvents(getState())) {
        // need to fetch items
        dispatch(fetchEvents(initialEventDateString));
    }
};

const fetchLatLngRequest = (): ActionTypes.FetchLatLngRequest => ({
    type: SCHEDULE_ACTIONS.FETCH_LAT_LNG_REQUEST,
});

const fetchLatLngError = (): ActionTypes.FetchLatLngError => ({
    type: SCHEDULE_ACTIONS.FETCH_LAT_LNG_ERROR,
});

const fetchLatLngSuccess = (match: google.maps.GeocoderResult): ActionTypes.FetchLatLngSuccess => ({
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

export const createFetchLatLngAction = (location: string): ThunkAction<void, GlobalStateShape, void> => (dispatch, getState) => {
    if (shouldFetchLatLng(getState())) {
        dispatch(fetchLatLng(location));
    }
};

export const dispatchSelectEvent = (eventItem: EventItemShape) => (dispatch: Dispatch<GlobalStateShape>) => (
    dispatch({
        type: SCHEDULE_ACTIONS.SELECT_EVENT,
        eventItem,
    } as ActionTypes.SelectEvent)
);

export const dispatchAnimateStart = () => (dispatch: Dispatch<GlobalStateShape>) => (
    dispatch({
        type: SCHEDULE_ACTIONS.SCROLL_START,
    } as ActionTypes.ScrollStart)
);

export const dispatchAnimateFinish = () => (dispatch: Dispatch<GlobalStateShape>) => (
    dispatch({
        type: SCHEDULE_ACTIONS.SCROLL_FINISH,
    } as ActionTypes.ScrollFinish)
);
