import _ from 'lodash';
import moment from 'moment-timezone';

const defaultValueHandlers = Object.freeze({
    array: {
        set: (target, key, val) => {
            if (target.hasOwnProperty(key)) {
                target[key].push(val);
            } else {
                target[key] = [val];
            }
            return true;
        }
    },
    onlyOne: {
        set: (target, key, val) => {
            if (!target.hasOwnProperty(key)) {
                target[key] = val;
            }
            return true;
        }
    }
});

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
        this.name = properties.summary;
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
     * @property {object<string,array<DayItem>>} monthToEventsMap
     * @property {object<string,array<MonthItem>>} monthToMonthMap
     * @property {array<string>} months - List of month names ordered by time.
     *
     * @param {array<object>} events - List of events returned by the Google Calendar API,
     *                                 ordered in ascending chronological order.
     */
    constructor(events) {
        this.monthToEventsMap = new Proxy({}, defaultValueHandlers.array);
        this.monthToMonthMap = new Proxy({}, defaultValueHandlers.onlyOne);
        this.months = [];
        this._populateMonthMapsAndMonthsList(events);

        // Freeze these properties. This class is purely presentational.
        this.monthToEventsMap = Object.freeze(this.monthToEventsMap);
        this.monthToMonthMap = Object.freeze(this.monthToMonthMap);
        this.months = Object.freeze(this.months);
    }

    /**
     * Returns a list item objects (i.e. either a DayItem or MonthItem).
     * If no month is provided, the list will not be filtered by month.
     *
     * @param {string=} month
     */
    getEvents(month = null) {
        const items = [];
        const months = !!month ? [month] : this.months;
        _.forEach(months, (month, index) => {
            items.push(this.monthToMonthMap[month]);
            _.forEach(this.monthToEventsMap[month], (event, index) => {
                items.push(event);
            });
        });
        return items;
    }

    /**
     * Initializes this EventItemsWrapper's properties.
     */
    _populateMonthMapsAndMonthsList(events) {
        const monthsSeen = new Set();
        _.forEach(events, (event, index) => {
            const eventDateTime = _extractEventDateTime(event);
            const description = _extractEventDescription(event);
            const month = eventDateTime.format('MMMM');
            this.monthToEventsMap[month] = createListItem('day', {
                name: event.summary,
                day: parseInt(eventDateTime.format('D')),
                time: eventDateTime.format('h:mm z'),
                program: description.program,
                collaborators: description.collaborators,
                eventType: description.type.value,
            });
            this.monthToMonthMap[month] = createListItem('month', {month: month});
            if (!monthsSeen.has(month)) {
                monthsSeen.add(month);
                this.months.push(month);
            }
        });
    }
}
