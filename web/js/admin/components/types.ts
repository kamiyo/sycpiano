import { Moment } from 'moment-timezone';

export interface AdminEventFormStateShape {
    collaborators: string;
    date: Moment;
    eventId: string;
    eventName: string;
    geocodeError: boolean;
    isUpdate: boolean;
    location: string;
    noTime: boolean;
    program: string;
    time: string;
    type: {
        value: string;
        label: string;
    };
    website: string;
}

export interface AdminEventListStateShape {
    events: GoogleCalendar.Event[];
    isFetching: boolean;
}

export interface CalendarEventShape {
    collaborators: string;
    date: Moment;
    eventId?: string;
    eventName: string;
    location: string;
    program: string;
    time: string;
    timeTBD: boolean;
    type: {
        label: string;
        value: string;
    };
    website: string;
}

export interface AdminStoreShape {
    eventForm: AdminEventFormStateShape;
    eventList: AdminEventListStateShape;
}
