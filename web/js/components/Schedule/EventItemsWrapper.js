import _ from 'lodash';
import moment from 'moment-timezone';

/**
 * Takes an event resource as returned by the Calendar API, and extracts the
 * event's start dateTime into a moment object.
 * @param  {object} event
 * @return {moment}
 */
function _extractEventDateTime(event) {
    if (event.start.dateTime) {
        return moment(event.start.dateTime).tz(event.start.timeZone);
    } else {
        return moment(event.start.date);
    }
}

/**
 * Takes an event resource as returned by the Calendar API, and extracts the
 * event's description into a JS object.
 * @param  {object} event
 * @return {object}
 */
function _extractEventDescription(event) {
    try {
        return JSON.parse(event.description);
    } catch (e) {
        return {};
    }
}

class DayItem {
    constructor(properties) {
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
     * @param {array<object>} events - List of events returned by the Google Calendar API,
     *                                 ordered in ascending chronological order.
     */
    constructor(events) {
        const eventItems = this.getEventItems(events);

        // Freeze these properties. This class is purely presentational.
        this.eventItems = Object.freeze(eventItems);
    }

    /**
     * Takes gcal events, and processes them into a list of list items (i.e. DayItem or MonthItem).
     */
    getEventItems(events) {
        const monthsSeen = new Set();

        return events.reduce((runningEventsArr, event) => {
            const eventDateTime = _extractEventDateTime(event);
            const month = eventDateTime.format('MMMM');
            const description = _extractEventDescription(event);

            const nextEventsArr = [];
            if (!monthsSeen.has(month)) {
                monthsSeen.add(month);
                nextEventsArr.push(createListItem('month', { month }));
            }

            nextEventsArr.push(createListItem('day', {
                id: event.id,
                name: event.summary,
                dateTime: eventDateTime,
                collaborators: description.collaborators,
                eventType: description.type.value,
                location: event.location,
                program: description.program,
            }));

            return [ ...runningEventsArr, ...nextEventsArr ];
        }, []);
    }
}
