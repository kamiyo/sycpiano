import moment from 'moment';

import { EventItemsWrapper } from '@/js/components/Schedule/EventItemsWrapper.js';

export const dateReducer = (state = moment(), action) => {
    switch (action.type) {
        case 'UPDATE_DATE':
            return action.date;
        default:
            return state;
    };
};

export const eventItemsReducer = (state = {
    items: [],
    eventItemsWrapper: null,
    isFetching: false,
    currentScrollIndex: 0,
}, action) => {
    switch (action.type) {
        case 'SCHEDULE--FETCH_EVENTS_SUCCESS':
            const wrapper = new EventItemsWrapper(action.fetchedEvents);
            return {
                eventItemsWrapper: wrapper,
                items: wrapper.eventItems,
                isFetching: false,
            };
        case 'SCHEDULE--FETCHING_EVENTS':
            return state.isFetching ? state : { ...state, isFetching: true }
        case 'SCHEDULE--UPDATE_DATE':
            if (!state.eventItemsWrapper || state.isFetching) return state;
            const month = action.date.format('MMMM');
            return {
                ...state,
                currentScrollIndex: state.eventItemsWrapper.monthToListIndexMap[month],
            };
        default:
            return state;
    };
};
