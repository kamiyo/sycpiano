import { Moment } from 'moment-timezone';

import ADMIN_SCHEDULE from 'src/admin/components/actionTypeKeys';

export interface EditEvent {
    readonly type: typeof ADMIN_SCHEDULE.EDIT_EVENT;
    readonly event: GoogleCalendar.Event;
}

export interface UpdateDate {
    readonly type: typeof ADMIN_SCHEDULE.UPDATE_DATE;
    readonly date: Moment;
}

export interface UpdateType {
    readonly type: typeof ADMIN_SCHEDULE.UPDATE_TYPE;
    readonly value: {
        readonly value: string;
        readonly label: string;
    };
}

export interface UpdateName {
    readonly type: typeof ADMIN_SCHEDULE.UPDATE_NAME;
    readonly value: string;
}

export interface UpdateLocation {
    readonly type: typeof ADMIN_SCHEDULE.UPDATE_LOCATION;
    readonly value: string;
}

export interface UpdateTime {
    readonly type: typeof ADMIN_SCHEDULE.UPDATE_TIME;
    readonly value: string;
}

export interface UpdateProgram {
    readonly type: typeof ADMIN_SCHEDULE.UPDATE_PROGRAM;
    readonly value: string;
}

export interface UpdateCollaborators {
    readonly type: typeof ADMIN_SCHEDULE.UPDATE_COLLABORATORS;
    readonly value: string;
}

export interface UpdateNotime {
    readonly type: typeof ADMIN_SCHEDULE.UPDATE_NOTIME;
    readonly value: boolean;
}

export interface UpdateWebsite {
    readonly type: typeof ADMIN_SCHEDULE.UPDATE_WEBSITE;
    readonly value: string;
}

export interface GeocodeError {
    readonly type: typeof ADMIN_SCHEDULE.GEOCODE_ERROR;
}

export interface OtherAction {
    readonly type: typeof ADMIN_SCHEDULE.OTHER_ACTION;
}

export interface FetchEventsSuccess {
    readonly type: typeof ADMIN_SCHEDULE.FETCH_EVENTS_SUCCESS;
    readonly fetchedEvents: GoogleCalendar.Event[];
}

export interface FetchEventsRequest {
    readonly type: typeof ADMIN_SCHEDULE.FETCH_EVENTS_REQUEST;
}

export interface FetchEventsError {
    readonly type: typeof ADMIN_SCHEDULE.FETCH_EVENTS_ERROR;
}

type ActionTypes = EditEvent | UpdateDate | UpdateType | UpdateName | UpdateLocation |
                   UpdateTime | UpdateProgram | UpdateCollaborators | UpdateNotime |
                   UpdateWebsite | GeocodeError | FetchEventsError | FetchEventsRequest |
                   FetchEventsSuccess | OtherAction;

export default ActionTypes;
