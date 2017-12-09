import { Moment } from 'moment-timezone';

import { DayItemInputShape, MonthItemInputShape } from 'src/components/Schedule/types';

class DayItem {
    readonly id: string;
    readonly type: 'day';
    readonly name: string;
    readonly program: string[];
    readonly collaborators: string[];
    readonly eventType: 'concerto' | 'chamber' | 'solo' | 'masterclass';
    readonly dateTime: Moment;
    readonly location: string;

    constructor(properties: DayItemInputShape) {
        this.id = properties.id;
        this.type = 'day';
        this.name = properties.name;
        this.program = properties.program;
        this.collaborators = properties.collaborators;
        this.eventType = properties.eventType;
        this.dateTime = properties.dateTime;
        this.location = properties.location;
    }
}

class MonthItem {
    readonly type: 'month';
    readonly month: string;
    readonly year: number;
    constructor(properties: MonthItemInputShape) {
        this.type = 'month';
        this.month = properties.month;
        this.year = properties.year;
    }
}

export default (itemType: 'day' | 'month', properties: DayItemInputShape | MonthItemInputShape) => {
    switch (itemType) {
        case 'day':
            return new DayItem(properties as DayItemInputShape);
        case 'month':
            return new MonthItem(properties as MonthItemInputShape);
        default:
            return null;
    }
};
