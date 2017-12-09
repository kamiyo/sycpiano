import { Moment } from 'moment-timezone';

export interface AdminEventFormStateShape {
    readonly collaborators: string;
    readonly date: Moment;
    readonly eventId: string;
    readonly eventName: string;
    readonly geocodeError: boolean;
    readonly isUpdate: boolean;
    readonly location: string;
    readonly noTime: boolean;
    readonly program: string;
    readonly time: string;
    readonly type: {
        readonly value: string;
        readonly label: string;
    };
    readonly website: string;
}

export interface AdminEventListStateShape {
    readonly events: GoogleCalendar.Event[];
    readonly isFetching: boolean;
}

export interface CalendarEventShape {
    readonly collaborators: string;
    readonly date: Moment;
    readonly eventId?: string;
    readonly eventName: string;
    readonly location: string;
    readonly program: string;
    readonly time: string;
    readonly timeTBD: boolean;
    readonly type: {
        readonly label: string;
        readonly value: string;
    };
    readonly website: string;
}

export interface AdminStoreShape {
    readonly eventForm: AdminEventFormStateShape;
    readonly eventList: AdminEventListStateShape;
}
