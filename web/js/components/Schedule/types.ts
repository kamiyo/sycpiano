import { Moment } from 'moment-timezone';

export interface DayItemInputShape {
    id: string;
    name: string;
    collaborators: string[];
    eventType: 'concerto' | 'chamber' | 'solo' | 'masterclass';
    dateTime: Moment;
    location: string;
    program: string[];
}

export interface MonthItemInputShape {
    month: string;
}

export interface DayItemShape extends DayItemInputShape {
    type: 'day' | 'month';
}

export interface MonthItemShape extends MonthItemInputShape {
    type: 'day' | 'month';
}

export type EventItemShape = DayItemShape | MonthItemShape;
