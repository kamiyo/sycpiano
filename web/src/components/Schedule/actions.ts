import SCHEDULE_ACTIONS from 'src/components/Schedule/actionTypeKeys';
import * as ActionTypes from 'src/components/Schedule/actionTypes';
import { DayItemShape, EventItemShape } from 'src/components/Schedule/types';
import { GlobalStateShape } from 'src/types';

import axios from 'axios';

import { default as moment, Moment } from 'moment-timezone';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { transformCachedEventsToListItems } from 'src/components/Schedule/utils';
import { googleAPI } from 'src/services/GoogleAPI';

const FETCH_LIMIT = 10;

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
    return !eventItemsReducer.isFetchingList;
};

interface FetchEventsArguments {
    initialEventDateString?: string;
    before?: Moment;
    after?: Moment;
}

const fetchEvents = ({ initialEventDateString = '', before, after }: FetchEventsArguments): ThunkAction<void, GlobalStateShape, void> => async (dispatch) => {
    try {
        dispatch(fetchEventsRequest());
        let params: {
            before?: string;
            after?: string;
            limit: number;
        };
        if (before) {
            params.before = before.format();
        } else if (after) {
            params.after = after.format();
        }
        params.limit = FETCH_LIMIT;

        calendarResponse = await axios.get('/api/calendar', {
            params: {
                after: moment().format(),
            },
        });
        const listItems = transformCachedEventsToListItems(calendarResponse.data);
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

export const createFetchEventsAction = (args: FetchEventsArguments): ThunkAction<void, GlobalStateShape, void> => (dispatch, getState) => {
    if (shouldFetchEvents(getState())) {
        // need to fetch items
        dispatch(fetchEvents(args));
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
        dispatch(fetchLatLngSuccess(firstMatch));
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
