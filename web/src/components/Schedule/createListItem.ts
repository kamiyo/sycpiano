import { Moment } from 'moment-timezone';

import { Collaborators, DayItemInputShape, EventItemInputShape, MonthItemInputShape, Pieces } from 'src/components/Schedule/types';

class DayItem {
    readonly id: string;
    readonly type: 'day';
    readonly name: string;
    readonly program: Pieces;
    readonly collaborators: Collaborators;
    readonly eventType: 'concerto' | 'chamber' | 'solo' | 'masterclass';
    readonly dateTime: Moment;
    readonly location: string;
    readonly website: string;

    constructor(properties: DayItemInputShape) {
        this.id = properties.id;
        this.type = 'day';
        this.name = properties.name;
        this.program = properties.program;
        this.collaborators = properties.collaborators;
        this.eventType = properties.eventType;
        this.dateTime = properties.dateTime;
        this.location = properties.location;
        this.website = properties.website;
    }
}

class MonthItem {
    readonly type: 'month';
    readonly month: string;
    readonly year: number;
    readonly dateTime: Moment;
    constructor(properties: MonthItemInputShape) {
        this.type = 'month';
        this.month = properties.month;
        this.year = properties.year;
        this.dateTime = properties.dateTime;
    }
}

export default (itemType: 'day' | 'month', properties: EventItemInputShape) => {
    switch (itemType) {
        case 'day':
            return new DayItem(properties as DayItemInputShape);
        case 'month':
            return new MonthItem(properties as MonthItemInputShape);
        default:
            return null;
    }
};
