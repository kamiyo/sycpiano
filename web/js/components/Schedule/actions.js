import _ from 'lodash';
import { transformGCalEventsToListItems } from '@/js/components/Schedule/utils.js';
import { googleAPI } from '@/js/services/GoogleAPI.js';

export const SCHEDULE = {
    FETCH_EVENTS_SUCCESS: 'SCHEDULE--FETCH_EVENTS_SUCCESS',
    FETCH_EVENTS_REQUEST: 'SCHEDULE--FETCH_EVENTS_REQUEST',
    FETCH_LAT_LNG_REQUEST: 'SCHEDULE--FETCH_LAT_LNG_REQUEST',
    FETCH_LAT_LNG_SUCCESS: 'SCHEDULE--FETCH_LAT_LNG_SUCCESS',
    SELECT_EVENT: 'SCHEDULE--SELECT_EVENT',
};

const fetchEventsRequest = () => ({
    type: SCHEDULE.FETCH_EVENTS_REQUEST
});

const fetchEventsSuccess = (listItems, currentItem) => ({
    type: SCHEDULE.FETCH_EVENTS_SUCCESS,
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

const _fetchEvents = () => (
    dispatch => {
        dispatch(fetchEventsRequest());
        return googleAPI.getCalendarEvents()
            .then(response => {
                const listItems = transformGCalEventsToListItems(response.data.items);
                const currentItem = listItems.find(item => item.type !== 'month');
                return dispatch(fetchEventsSuccess(listItems, currentItem));
            });
    }
);

export const fetchEvents = () => (
    (dispatch, getState) => {
        if (shouldFetchEvents(getState())) {
            // need to fetch items
            return dispatch(_fetchEvents());
        } else {
            // already have items
            return Promise.resolve();
        }
    }
);