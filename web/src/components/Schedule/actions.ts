import SCHEDULE_ACTIONS from 'src/components/Schedule/actionTypeKeys';
import * as ActionTypes from 'src/components/Schedule/actionTypes';
import {
    CachedEvent,
    DayItem,
    EventItemType,
    EventListName,
    FetchEventsAPIParams,
    FetchEventsArguments,
    itemIsDay,
    SearchEventsArguments,
} from 'src/components/Schedule/types';
import { GlobalStateShape } from 'src/types';

import axios from 'axios';

import { ThunkAction } from 'redux-thunk';

import { transformCachedEventsToListItems } from 'src/components/Schedule/utils';

const FETCH_LIMIT = 25;

const fetchEventsRequest = (name: EventListName): ActionTypes.FetchEventsRequest => ({
    name,
    type: SCHEDULE_ACTIONS.FETCH_EVENTS_REQUEST,
});

const fetchEventsError = (name: EventListName): ActionTypes.FetchEventsError => ({
    name,
    type: SCHEDULE_ACTIONS.FETCH_EVENTS_ERROR,
});

type FetchEventsSuccess = (
    name: EventListName,
    listItems: EventItemType[],
    currentItem: DayItem,
    hasMore: boolean,
    monthsSeen: Set<string>,
    lastQuery?: string,
) => ActionTypes.FetchEventsSuccess;

const fetchEventsSuccess: FetchEventsSuccess = (name, listItems, currentItem, hasMore, monthsSeen, lastQuery) => ({
    name,
    type: SCHEDULE_ACTIONS.FETCH_EVENTS_SUCCESS,
    listItems,
    currentItem,
    hasMore,
    lastQuery,
    setOfMonths: monthsSeen,
});

const shouldFetchEvents = (name: EventListName, state: GlobalStateShape) => {
    const eventItemsReducer = state.schedule_eventItems[name];
    // should not call, api is fetching, or the last fetch was empty
    return !eventItemsReducer.isFetchingList && eventItemsReducer.hasMore;
};

type FetchEventsActions = ActionTypes.FetchEventsError | ActionTypes.FetchEventsRequest | ActionTypes.FetchEventsSuccess;

const fetchEvents = (name: EventListName, { after, before, date, scrollTo }: FetchEventsArguments): ThunkAction<void, GlobalStateShape, void, FetchEventsActions> => async (dispatch, getState) => {
    try {
        dispatch(fetchEventsRequest(name));
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
        const { events: listItems, monthsSeen } = transformCachedEventsToListItems(data, state[name].setOfMonths);
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
        dispatch(fetchEventsSuccess(name, listItems, currentItem, hasMore, monthsSeen));
    } catch (err) {
        dispatch(fetchEventsError(name));
        console.log('fetch events error', err);
    }
};

export const createFetchEventsAction = (name: EventListName, args: FetchEventsArguments): ThunkAction<void, GlobalStateShape, void, FetchEventsActions> => (dispatch, getState) => {
    if (shouldFetchEvents(name, getState())) {
        // need to fetch items
        dispatch(fetchEvents(name, args));
    }
};

const clearList = (name: EventListName): ActionTypes.ClearList => ({
    name,
    type: SCHEDULE_ACTIONS.CLEAR_LIST,
});

export const createSearchEventsAction = (name: EventListName, args: SearchEventsArguments): ThunkAction<void, GlobalStateShape, void, FetchEventsActions | ActionTypes.ClearList> => async (dispatch, getState) => {
    try {
        const params = {
            q: args.q,
        };
        const state = getState().schedule_eventItems.search;
        if (state.isFetchingList || !state.hasMore && state.lastQuery === args.q) {
            return;
        }
        dispatch(clearList(name));
        if (args.q === '') {
            dispatch(fetchEventsSuccess(name, [], undefined, false, new Set<string>(), args.q));
            return;
        }
        dispatch(fetchEventsRequest(name));

        const { data }: { data: CachedEvent[]; } = await axios.get('/api/calendar/search', { params });
        const { events: listItems, monthsSeen } = transformCachedEventsToListItems(data, new Set<string>());

        dispatch(fetchEventsSuccess(name, listItems, undefined, false, monthsSeen, args.q));
    } catch (err) {
        dispatch(fetchEventsError(name));
        console.log('search events error', err);
    }
};

export const selectEvent = (name: EventListName, eventItem: DayItem): ActionTypes.SelectEvent => ({
    name,
    type: SCHEDULE_ACTIONS.SELECT_EVENT,
    eventItem,
});
