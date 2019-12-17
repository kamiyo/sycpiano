import SCHEDULE_ACTIONS from 'src/components/Schedule/actionTypeKeys';
import { ActionTypes } from 'src/components/Schedule/actionTypes';
import {
    EventItemsStateShape,
    EventItemType,
    ScheduleStateShape,
} from 'src/components/Schedule/types';

import { SortedArraySet } from 'collections/sorted-array-set';
import { default as moment, Moment } from 'moment';

const dateTimeFormat = 'YYYY-MM-DDTHH:mm';
const dateFormat = 'YYYY-MM-DD';

function equals(a: EventItemType, b: EventItemType) {
    // return a.dateTime.isSame(b.dateTime, 'minute');
    return (a.dateTime.format(dateTimeFormat) === b.dateTime.format(dateTimeFormat));
}

function ascendCompare(a: EventItemType, b: EventItemType) {
    // if (a.dateTime.isSame(b.dateTime, 'minute')) { return 0; }
    // if (a.dateTime.isBefore(b.dateTime, 'minute')) { return -1; }
    // if (a.dateTime.isAfter(b.dateTime, 'minute')) { return 1; }
    const aTime = (a.type === 'month') ? a.dateTime.startOf('month').format(dateFormat) : a.dateTime.format(dateTimeFormat);
    const bTime = (b.type === 'month') ? b.dateTime.startOf('month').format(dateFormat) : b.dateTime.format(dateTimeFormat);
    return aTime.localeCompare(bTime);
}

function descendCompare(a: EventItemType, b: EventItemType) {
    const aTime = (a.type === 'month') ? a.dateTime.endOf('month').format(dateFormat) : a.dateTime.format(dateTimeFormat);
    const bTime = (b.type === 'month') ? b.dateTime.endOf('month').format(dateFormat) : b.dateTime.format(dateTimeFormat);
    // if (aTime.isSame(bTime, 'minute')) { return 0; }
    // if (aTime.isBefore(bTime, 'minute')) { return 1; }
    // if (aTime.isAfter(bTime, 'minute')) { return -1; }
    return bTime.localeCompare(aTime);
}

const initialState: EventItemsStateShape = {
    items: null,
    itemArray: [],
    currentItem: null,
    currentLatLng: {
        lat: 39.0997,
        lng: -94.5786,
    },
    hasEventBeenSelected: false,
    isFetchingList: false,
    isFetchingLatLng: false,
    minDate: undefined as Moment,
    maxDate: undefined as Moment,
    setOfMonths: new Set<string>(),
    hasMore: true,
};

const eventItemsReducer = (
    state: EventItemsStateShape = initialState,
    action: ActionTypes,
) => {
    switch (action.type) {
        case SCHEDULE_ACTIONS.CLEAR_LIST:
            return {
                ...state,
                hasMore: true,
                isFetchingList: false,
                items: new SortedArraySet<EventItemType>([], equals, descendCompare),
                setOfMonths: new Set<string>(),
                itemArray: [],
                lastQuery: '',
            };
        case SCHEDULE_ACTIONS.FETCH_EVENTS_SUCCESS:
            state.items.addEach(action.listItems);
            return {
                ...state,
                itemArray: state.items.toArray(),
                isFetchingList: false,
                currentItem: action.currentItem ? action.currentItem : state.currentItem,
                // because of sorting mechanism, reverse list has min and max reversed
                minDate: state.items.length ? moment.min(state.items.min().dateTime, state.items.max().dateTime) : moment(),
                maxDate: state.items.length ? moment.max(state.items.min().dateTime, state.items.max().dateTime) : moment(),
                setOfMonths: action.setOfMonths,
                hasMore: action.hasMore,
                lastQuery: action.lastQuery,
            };
        case SCHEDULE_ACTIONS.FETCH_EVENTS_REQUEST:
            return {
                ...state,
                isFetchingList: true,
            };
        case SCHEDULE_ACTIONS.FETCH_EVENTS_ERROR:
            return {
                ...state,
                isFetchingList: false,
            };
        case SCHEDULE_ACTIONS.FETCH_LAT_LNG_REQUEST:
            return {
                ...state,
                isFetchingLatLng: true,
            };
        case SCHEDULE_ACTIONS.FETCH_LAT_LNG_ERROR:
            return {
                ...state,
                isFetchingLatLng: false,
            };
        case SCHEDULE_ACTIONS.FETCH_LAT_LNG_SUCCESS:
            return {
                ...state,
                isFetchingLatLng: false,
                currentLatLng: { lat: action.lat, lng: action.lng },
            };
        case SCHEDULE_ACTIONS.SELECT_EVENT:
            return {
                ...state,
                hasEventBeenSelected: true,
                currentItem: action.eventItem,
            };
        default:
            return state;
    }
};

export const scheduleReducer = (state: ScheduleStateShape = {
    upcoming: {
        ...initialState,
        items: new SortedArraySet<EventItemType>([], equals, ascendCompare),
    },
    archive: {
        ...initialState,
        items: new SortedArraySet<EventItemType>([], equals, descendCompare),
    },
    search: {
        ...initialState,
        items: new SortedArraySet<EventItemType>([], equals, descendCompare),
        lastQuery: '',
    },
}, action: ActionTypes) => {
    switch (action.name) {
        case 'upcoming':
            return {
                ...state,
                upcoming: eventItemsReducer(state.upcoming, action),
            };
        case 'archive':
            return {
                ...state,
                archive: eventItemsReducer(state.archive, action),
            };
        case 'search':
            return {
                ...state,
                search: eventItemsReducer(state.search, action),
            };
        default:
            return state;
    }
};
