import SCHEDULE_ACTIONS from 'src/components/Schedule/actionTypeKeys';
import * as ActionTypes from 'src/components/Schedule/actionTypes';
import {
    CachedEvent,
    DayItem,
    EventItemType,
    FetchEventsAPIParams,
    FetchEventsArguments,
    itemIsDay,
    LatLng,
} from 'src/components/Schedule/types';
import { GlobalStateShape } from 'src/types';

import axios from 'axios';

import { ThunkAction } from 'redux-thunk';

import { EventListName } from 'src/components/Schedule/actionTypes';
import { transformCachedEventsToListItems } from 'src/components/Schedule/utils';
import { geocode } from 'src/services/GoogleAPI';

const FETCH_LIMIT = 10;

export const switchList = (name: EventListName): ActionTypes.SwitchList => ({
    type: SCHEDULE_ACTIONS.SWITCH_LIST,
    name,
});

const fetchEventsRequest = (): ActionTypes.FetchEventsRequest => ({
    type: SCHEDULE_ACTIONS.FETCH_EVENTS_REQUEST,
});

const fetchEventsError = (): ActionTypes.FetchEventsError => ({
    type: SCHEDULE_ACTIONS.FETCH_EVENTS_ERROR,
});

type FetchEventsSuccess = (
    listItems: EventItemType[],
    currentItem: DayItem,
    hasMore: boolean,
) => ActionTypes.FetchEventsSuccess;

const fetchEventsSuccess: FetchEventsSuccess = (listItems, currentItem, hasMore) => ({
    type: SCHEDULE_ACTIONS.FETCH_EVENTS_SUCCESS,
    listItems,
    currentItem,
    hasMore,
});

/* EDIT THIS */
const shouldFetchEvents = (state: GlobalStateShape) => {
    const activeName = state.schedule_eventItems.activeName;
    const eventItemsReducer = state.schedule_eventItems[activeName];
    // should not call, api is fetching, or the last fetch was empty
    return !eventItemsReducer.isFetchingList && eventItemsReducer.hasMore;
};

const fetchEvents = ({ after, before, date, scrollTo }: FetchEventsArguments): ThunkAction<void, GlobalStateShape, void> => async (dispatch, getState) => {
    try {
        dispatch(fetchEventsRequest());
        const params: FetchEventsAPIParams = {
            limit: FETCH_LIMIT,
        };

        if (date) {
            params.date = date.format();
        } else if (after) {
            params.after = after.format();
        } else if (before) {
            params.before = before.format();
        }

        const calendarResponse = await axios.get('/api/calendar', { params });
        const data: CachedEvent[] = calendarResponse.data;
        const state = getState().schedule_eventItems;
        const listItems = transformCachedEventsToListItems(data, state[state.activeName].setOfMonths);

        let currentItem: DayItem;
        const desiredDate = date || after || before;
        // find closest event to desired date.
        if (scrollTo) {
            currentItem = listItems.reduce((acc: EventItemType, item: EventItemType) => {
                if (!acc) {
                    return itemIsDay(item) && item;
                }
                return Math.abs(item.dateTime.diff(desiredDate, 'day', true)) < Math.abs(acc.dateTime.diff(desiredDate, 'day', true)) ? item : acc;
            }, undefined) as DayItem;
        }
        const hasMore = !!listItems.length;
        dispatch(fetchEventsSuccess(listItems, currentItem, hasMore));
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

const fetchLatLngSuccess = (latlng: LatLng): ActionTypes.FetchLatLngSuccess => ({
    type: SCHEDULE_ACTIONS.FETCH_LAT_LNG_SUCCESS,
    lat: latlng.lat,
    lng: latlng.lng,
});

const shouldFetchLatLng = (state: GlobalStateShape) => {
    const eventItemsReducer = state.schedule_eventItems[state.schedule_eventItems.activeName];
    return !eventItemsReducer.isFetchingLatLng;
};

const fetchLatLng = (location: string): ThunkAction<void, GlobalStateShape, void> => async (dispatch) => {
    try {
        dispatch(fetchLatLngRequest());
        const geocodeResponse = await geocode(location);
        const latlng: LatLng = geocodeResponse.data.results[0].geometry.location;
        dispatch(fetchLatLngSuccess(latlng));
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

export const selectEvent = (eventItem: DayItem): ActionTypes.SelectEvent => ({
    type: SCHEDULE_ACTIONS.SELECT_EVENT,
    eventItem,
});
