import { Moment } from 'moment-timezone';
import { DayItemInputShape, MonthItemInputShape } from 'js/components/Schedule/types';

class DayItem {
    id: string;
    type: 'day';
    name: string;
    program: string[];
    collaborators: string[];
    eventType: 'concerto' | 'chamber' | 'solo' | 'masterclass';
    dateTime: Moment;
    location: string;

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
    type: 'month';
    month: string;
    constructor(properties: MonthItemInputShape) {
        this.type = 'month';
        this.month = properties.month;
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
