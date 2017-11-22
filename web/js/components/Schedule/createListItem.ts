import { Moment } from 'moment-timezone';

interface DayInputShape {
    id: string;
    name: string;
    collaborators: string[];
    eventType: 'concerto' | 'chamber' | 'solo' | 'masterclass';
    dateTime: Moment;
    location: string;
    program: string[];
}

interface MonthInputShape {
    month: string;
}

class DayItem {
    id: string;
    type: 'day';
    name: string;
    program: string[];
    collaborators: string[];
    eventType: 'concerto' | 'chamber' | 'solo' | 'masterclass';
    dateTime: Moment;
    location: string;

    constructor(properties: DayInputShape) {
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
    constructor(properties: MonthInputShape) {
        this.type = 'month';
        this.month = properties.month;
    }
}

export default (itemType: 'day' | 'month', properties: DayInputShape | MonthInputShape) => {
    switch (itemType) {
        case 'day':
            return new DayItem(properties as DayInputShape);
        case 'month':
            return new MonthItem(properties as MonthInputShape);
        default:
            return null;
    }
};
