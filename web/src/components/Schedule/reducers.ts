import SCHEDULE_ACTIONS from 'src/components/Schedule/actionTypeKeys';
import ActionType from 'src/components/Schedule/actionTypes';
import {
    EventItemsStateShape,
    EventItemType,
    ScheduleStateShape,
} from 'src/components/Schedule/types';

import { SortedArraySet } from 'collections/sorted-array-set';
import { default as moment, Moment } from 'moment';

function equals(a: EventItemType, b: EventItemType) {
    return a.dateTime.isSame(b.dateTime, 'minute');
}

function ascendCompare(a: EventItemType, b: EventItemType) {
    if (a.dateTime.isSame(b.dateTime, 'minute')) { return 0; }
    if (a.dateTime.isBefore(b.dateTime, 'minute')) { return -1; }
    if (a.dateTime.isAfter(b.dateTime, 'minute')) { return 1; }
}

function descendCompare(a: EventItemType, b: EventItemType) {
    const aTime = (a.type === 'month') ? moment(a.dateTime).endOf('month') : a.dateTime;
    const bTime = (b.type === 'month') ? moment(b.dateTime).endOf('month') : b.dateTime;
    if (aTime.isSame(bTime, 'minute')) { return 0; }
    if (aTime.isBefore(bTime, 'minute')) { return 1; }
    if (aTime.isAfter(bTime, 'minute')) { return -1; }
}

const initialState: EventItemsStateShape = {
    items: null,
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
    setOfMonths: new Set(),
    hasMore: true,
};

export const scheduleReducer = (state: ScheduleStateShape = {
    activeName: 'upcoming',
    upcoming: {
        ...initialState,
        items: new SortedArraySet<EventItemType>([], equals, ascendCompare),
    },
    archive: {
        ...initialState,
        items: new SortedArraySet<EventItemType>([], equals, descendCompare),
    },
}, action: ActionType) => {
    if (action.type === SCHEDULE_ACTIONS.SWITCH_LIST) {
        return {
            ...state,
            activeName: action.name,
        };
    }
    switch (state.activeName) {
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
        default:
            return state;
    }
};

const eventItemsReducer = (
    state: EventItemsStateShape = initialState,
    action: ActionType,
) => {
    switch (action.type) {
        case SCHEDULE_ACTIONS.FETCH_EVENTS_SUCCESS:
            state.items.addEach(action.listItems);
            return {
                ...state,
                isFetchingList: false,
                currentItem: action.currentItem ? action.currentItem : state.currentItem,
                // because of sorting mechanism, reverse list has min and max reversed
                minDate: moment.min(state.items.min().dateTime, state.items.max().dateTime),
                maxDate: moment.max(state.items.min().dateTime, state.items.max().dateTime),
                hasMore: action.hasMore,
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
