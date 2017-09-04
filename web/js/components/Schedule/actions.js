import { EventItemsWrapper } from '@/js/components/Schedule/EventItemsWrapper.js';
import _ from 'lodash';

export const SCHEDULE = {
    FETCH_EVENTS_SUCCESS: 'SCHEDULE--FETCH_EVENTS_SUCCESS',
    FETCH_EVENTS_REQUEST: 'SCHEDULE--FETCH_EVENTS_REQUEST',
    FETCH_LAT_LNG_REQUEST: 'SCHEDULE--FETCH_LAT_LNG_REQUEST',
    FETCH_LAT_LNG_SUCCESS: 'SCHEDULE--FETCH_LAT_LNG_SUCCESS',
    SELECT_EVENT: 'SCHEDULE--SELECT_EVENT',
};

fetchEventsRequest = () => ({
    type: SCHEDULE.FETCH_EVENTS_REQUEST
})

fetchEventsSuccess = (events) => {
    const wrapper = new EventItemsWrapper(events);
    // Initially default to the closest upcoming event.
    const currentItem = wrapper.eventItems.find(item => item.type !== 'month');
    return {
        type: SCHEDULE.FETCH_EVENTS_SUCCESS,
        fetchedEvents: events,
        currentItem: currentItem
    };
}