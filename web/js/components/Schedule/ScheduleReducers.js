import moment from 'moment';

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
    isFetching: false,
}, action) => {
    switch (action.type) {
        case 'FETCH_EVENTS_SUCCESS':
            return { items: action.fetchedEvents, isFetching: false };
        case 'FETCH_EVENTS':
            return state.isFetching ? state : { ...state, isFetching: true }
        default:
            return state;
    };
};
