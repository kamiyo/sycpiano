import _ from 'lodash';
import moment from 'moment-timezone';

/**
 * Takes an event resource as returned by the Calendar API, and extracts the
 * event's start dateTime into a moment object.
 * @param  {object} event
 * @return {moment}
 */
function _extractEventDateTime(event) {
    return moment(event.start.dateTime).tz(event.start.timeZone);
}

/**
 * Takes an event resource as returned by the Calendar API, and extracts the
 * event's description into a JS object.
 * @param  {object} event
 * @return {object}
 */
function _extractEventDescription(event) {
    return event.description ? JSON.parse(event.description) : {};
}

class DayItem {
    constructor(properties) {
        this.type = 'day';
        this.name = properties.name;
        this.day = properties.day;
        this.time = properties.time;
        this.program = properties.program;
        this.collaborators = properties.collaborators;
        this.eventType = properties.eventType;
    }
}

class MonthItem {
    constructor(properties) {
        this.type = 'month';
        this.month = properties.month;
    }
}

function createListItem(itemType, properties) {
    switch (itemType) {
        case 'day':
            return new DayItem(properties);
        case 'month':
            return new MonthItem(properties);
        default:
            return null;
    }
}

export class EventItemsWrapper {
    /**
     * Creates a wrapper that stores these properties:
     *
     * @property {array<(DayItem)|(MonthItem)>} eventItems
     * @property {object<string,int>} monthToRowIndexMap
     *
     * @param {array<object>} events - List of events returned by the Google Calendar API,
     *                                 ordered in ascending chronological order.
     */
    constructor(events) {
        const eventItemsAndMonthToListIndexMap = this._getEventItemsAndMonthToListIndexMap(events);
        this.eventItems = eventItemsAndMonthToListIndexMap.eventItems;
        this.monthToListIndexMap = eventItemsAndMonthToListIndexMap.monthToListIndexMap

        // Freeze these properties. This class is purely presentational.
        this.eventItems = Object.freeze(this.eventItems);
        this.monthToRowIndexMap = Object.freeze(this.monthToRowIndexMap);
    }

    /**
     * Gets the list of event items, as well as an object that maps month name to scroll index.
     */
    _getEventItemsAndMonthToListIndexMap(events) {
        const monthsSeen = new Set();
        const eventItems = [];
        const monthToListIndexMap = {};
        _.forEach(events, (event, index) => {
            const eventDateTime = _extractEventDateTime(event);
            const description = _extractEventDescription(event);
            const month = eventDateTime.format('MMMM');
            if (!monthsSeen.has(month)) {
                monthToListIndexMap[month] = index + monthsSeen.size;
                eventItems.push(createListItem('month', {month: month}));
                monthsSeen.add(month);
            }
            eventItems.push(createListItem('day', {
                name: event.summary,
                day: parseInt(eventDateTime.format('D')),
                time: eventDateTime.format('h:mm z'),
                program: description.program,
                collaborators: description.collaborators,
                eventType: description.type.value,
            }));
        });
        return { eventItems, monthToListIndexMap }
    }
}
