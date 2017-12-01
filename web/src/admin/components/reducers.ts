import moment from 'moment';

import { AdminEventFormStateShape, AdminEventListStateShape } from 'src/admin/components/types';
import { eventTypes } from 'src/admin/constants';
import { simplifyStringArray } from 'src/admin/utils';

import ADMIN_ACTIONS from 'src/admin/components/actionTypeKeys';
import ActionTypes from 'src/admin/components/actionTypes';

function parseEvent(event: GoogleCalendar.Event) {
    let description: {
        [key: string]: any;
    };
    try {
        description = JSON.parse(event.description);
    } catch (e) {
        console.log('Admin parse error: ', e);
    }
    const dateTime = moment((event.start.dateTime) ? event.start.dateTime : event.start.date);
    const time = (event.start.dateTime) ? (
        (event.start.timeZone) ?
            moment.tz(event.start.dateTime, event.start.timeZone).format('HH:mm') :
            moment.parseZone(event.start.dateTime).format('HH:mm')
    ) : '';
    const program = description.program.length ?
        simplifyStringArray(description.program).reduce((acc, piece, index) => {
            return acc + ((index) ? '\n' : '') + piece.toString();
        }, '') : '';

    const collaborators = description.collaborators.length ?
        simplifyStringArray(description.collaborators).reduce((acc, entity, index) => {
            return acc + ((index) ? '\n' : '') + entity.toString();
        }, '') : '';
    return {
        time,
        date: dateTime.startOf('day'),
        location: (event.location) ? event.location : '',
        eventName: (event.summary) ? event.summary : '',
        type: (description.type) ? description.type : '',
        program,
        collaborators,
        website: (description.website) ? decodeURI(description.website) : '',
        eventId: event.id,
        isUpdate: true,
        noTime: !event.start.dateTime,
    };
}

export const eventFormReducer = (state: AdminEventFormStateShape = {
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
    eventId: '',
}, action: ActionTypes) => {
    switch (action.type) {
        case ADMIN_ACTIONS.EDIT_EVENT:
            return { ...state, ...parseEvent(action.event) };
        case ADMIN_ACTIONS.UPDATE_DATE:
            return { ...state, date: action.date };
        case ADMIN_ACTIONS.UPDATE_TYPE:
            return { ...state, type: action.value };
        case ADMIN_ACTIONS.UPDATE_NAME:
            return { ...state, eventName: action.value };
        case ADMIN_ACTIONS.UPDATE_LOCATION:
            return { ...state, location: action.value, geocodeError: false };
        case ADMIN_ACTIONS.UPDATE_TIME:
            return { ...state, time: action.value };
        case ADMIN_ACTIONS.UPDATE_PROGRAM:
            return { ...state, program: action.value };
        case ADMIN_ACTIONS.UPDATE_COLLABORATORS:
            return { ...state, collaborators: action.value };
        case ADMIN_ACTIONS.UPDATE_NOTIME:
            return { ...state, noTime: action.value };
        case ADMIN_ACTIONS.UPDATE_WEBSITE:
            return { ...state, website: action.value };
        case ADMIN_ACTIONS.GEOCODE_ERROR:
            return { ...state, geocodeError: true };
        default:
            return state;
    }
};

export const eventListReducer = (state: AdminEventListStateShape = {
    events: [],
    isFetching: false,
}, action: ActionTypes) => {
    switch (action.type) {
        case ADMIN_ACTIONS.FETCH_EVENTS_SUCCESS:
            return {
                events: action.fetchedEvents.reverse(),
                isFetching: false,
            };
        case ADMIN_ACTIONS.FETCH_EVENTS_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case ADMIN_ACTIONS.FETCH_EVENTS_ERROR:
            return {
                events: [],
                isFetching: false,
            };
        default:
            return state;
    }
};
