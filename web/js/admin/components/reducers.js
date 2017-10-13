import moment from 'moment';

import { eventTypes } from '@/js/admin/constants.js';
import { simplifyArray } from '@/js/admin/utils.js';

function parseEvent(event) {
    let description = {};
    try {
        description = JSON.parse(event.description);
    } catch (e) {}
    const dateTime = moment((event.start.dateTime) ? event.start.dateTime : event.start.date);
    const time = (event.start.dateTime) ? (
        (event.start.timeZone) ?
            moment.tz(event.start.dateTime, event.start.timeZone).format('HH:mm') :
            moment.parseZone(event.start.dateTime).format('HH:mm')
    ) : '';
    const program = description.program.length ?
        simplifyArray(description.program).reduce((acc, piece, index, arr) => {
            return acc + ((index) ? '\n' : '') + piece.toString();
        }, '') : '';

    const collaborators = description.collaborators.length ?
        simplifyArray(description.collaborators).reduce((acc, entity, index, arr) => {
            return acc + ((index) ? '\n' : '') + entity.toString();
        }, '') : '';
    return {
        time: time,
        date: dateTime.startOf('day'),
        location: (event.location) ? event.location : '',
        eventName: (event.summary) ? event.summary : '',
        type: (description.type) ? description.type : '',
        program: program,
        collaborators: collaborators,
        website: (description.website) ? decodeURI(description.website) : '',
        eventId: event.id,
        isUpdate: true,
        noTime: !event.start.dateTime
    };
}

export const eventFormReducer = (state = {
    type: eventTypes[0],
    date: moment(),
    isUpdate: false,
    time: '',
    eventName: '',
    program: '',
    collaborators: '',
    location: '',
    website: '',
    noTime: false,
    geocodeError: false,
}, action) => {
    switch (action.type) {
        case 'EDIT_EVENT':
            return parseEvent(action.event);
        case 'UPDATE_DATE':
            return { ...state, date: action.date };
        case 'UPDATE_TYPE':
            return { ...state, type: action.value };
        case 'UPDATE_NAME':
            return { ...state, eventName: action.value };
        case 'UPDATE_LOCATION':
            return { ...state, location: action.value, geocodeError: false };
        case 'UPDATE_TIME':
            return { ...state, time: action.value };
        case 'UPDATE_PROGRAM':
            return { ...state, program: action.value };
        case 'UPDATE_COLLABORATORS':
            return { ...state, collaborators: action.value };
        case 'UPDATE_NOTIME':
            return { ...state, noTime: action.value };
        case 'UPDATE_WEBSITE':
            return { ...state, website: action.value };
        case 'GEOCODE_ERROR':
            return { ...state, geocodeError: true };
        default:
            return state;
    };
};

export const eventListReducer = (state = {
    events: [],
    isFetching: false,
}, action) => {
    switch (action.type) {
        case 'FETCH_EVENTS_SUCCESS':
            action.fetchedEvents.reverse();
            return {
                events: action.fetchedEvents,
                isFetching: false,
            };
        case 'IS_FETCHING':
            return state.isFetching ? state : { ...state, isFetching: true };
        default:
            return state;
    };
};
