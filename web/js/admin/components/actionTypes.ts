import ADMIN_SCHEDULE from 'js/admin/components/actionTypeKeys';
import { Moment } from 'moment-timezone';

export interface EditEvent {
    type: typeof ADMIN_SCHEDULE.EDIT_EVENT;
    event: GoogleCalendar.Event;
}

export interface UpdateDate {
    type: typeof ADMIN_SCHEDULE.UPDATE_DATE;
    date: Moment;
}

export interface UpdateType {
    type: typeof ADMIN_SCHEDULE.UPDATE_TYPE;
    value: {
        value: string;
        label: string;
    };
}

export interface UpdateName {
    type: typeof ADMIN_SCHEDULE.UPDATE_NAME;
    value: string;
}

export interface UpdateLocation {
    type: typeof ADMIN_SCHEDULE.UPDATE_LOCATION;
    value: string;
}

export interface UpdateTime {
    type: typeof ADMIN_SCHEDULE.UPDATE_TIME;
    value: string;
}

export interface UpdateProgram {
    type: typeof ADMIN_SCHEDULE.UPDATE_PROGRAM;
    value: string;
}

export interface UpdateCollaborators {
    type: typeof ADMIN_SCHEDULE.UPDATE_COLLABORATORS;
    value: string;
}

export interface UpdateNotime {
    type: typeof ADMIN_SCHEDULE.UPDATE_NOTIME;
    value: boolean;
}

export interface UpdateWebsite {
    type: typeof ADMIN_SCHEDULE.UPDATE_WEBSITE;
    value: string;
}

export interface GeocodeError {
    type: typeof ADMIN_SCHEDULE.GEOCODE_ERROR;
}

export interface OtherAction {
    type: typeof ADMIN_SCHEDULE.OTHER_ACTION;
}

export interface FetchEventsSuccess {
    type: typeof ADMIN_SCHEDULE.FETCH_EVENTS_SUCCESS;
    fetchedEvents: GoogleCalendar.Event[];
}

export interface FetchEventsRequest {
    type: typeof ADMIN_SCHEDULE.FETCH_EVENTS_REQUEST;
}

export interface FetchEventsError {
    type: typeof ADMIN_SCHEDULE.FETCH_EVENTS_ERROR;
}

type ActionTypes = EditEvent | UpdateDate | UpdateType | UpdateName | UpdateLocation |
                   UpdateTime | UpdateProgram | UpdateCollaborators | UpdateNotime |
                   UpdateWebsite | GeocodeError | FetchEventsError | FetchEventsRequest |
                   FetchEventsSuccess | OtherAction;

export default ActionTypes;
