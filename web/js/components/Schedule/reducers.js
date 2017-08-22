import moment from 'moment';

import { EventItemsWrapper } from '@/js/components/Schedule/EventItemsWrapper.js';

export const dateReducer = (state = {
    date: moment(),
    eventsFetched: false
}, action) => {
    switch (action.type) {
        case 'SCHEDULE--UPDATE_DATE':
            return { ...state, date: action.date};
        case 'SCHEDULE--PREV_MONTH':
            return { ...state, date: state.date.subtract(1, 'month')};
        case 'SCHEDULE--NEXT_MONTH':
            return { ...state, date: state.date.add(1, 'month')};
        case 'SCHEDULE--FETCH_EVENTS_SUCCESS':
            return { ...state, eventsFetched: true};
        default:
            return state;
    };
};

export const eventItemsReducer = (state = {
    items: [],
    eventItemsWrapper: null,
    isFetching: false,
    currentScrollIndex: 0,
    scrollTop: 0
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
        case 'SCHEDULE--PREV_MONTH':
        case 'SCHEDULE--NEXT_MONTH':
        case 'SCHEDULE--UPDATE_DATE':
            if (!state.eventItemsWrapper || state.isFetching) return state;

            // On date update, we want to scroll the events list to the start
            // of the selected month.
            const month = action.date.format('MMMM');
            const monthIndex = (
                state.eventItemsWrapper.monthToListIndexMap.hasOwnProperty(month) ?
                state.eventItemsWrapper.monthToListIndexMap[month] :
                state.currentScrollIndex
            );
            return { ...state, currentScrollIndex: monthIndex };
        case 'SCHEDULE--STORE_SCROLL':
            return { ...state, scrollTop: action.scrollTop };
        default:
            return state;
    };
};
