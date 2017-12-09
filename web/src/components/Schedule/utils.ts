import { default as moment } from 'moment-timezone';

import createListItem from 'src/components/Schedule/createListItem';
import { CachedEvent, EventItemShape, GCalEvent } from 'src/components/Schedule/types';

/**
 * Takes an event resource as returned by the Calendar API, and extracts the
 * event's start dateTime into a moment object.
 * @param  {object} event
 * @return {moment}
 */
const extractEventDateTime = (event: GCalEvent) => {
    if (event.start.dateTime) {
        return moment(event.start.dateTime).tz(event.start.timeZone);
    } else {
        return moment(event.start.date);
    }
};

/**
 * Takes an event resource as returned by the Calendar API, and extracts the
 * event's description into a JS object.
 * @param  {object} event
 * @return {object}
 */
const extractEventDescription = (event: GCalEvent | CachedEvent) => {
    try {
        return JSON.parse(event.description);
    } catch (e) {
        return {};
    }
};

/**
 * Takes gcal events, and processes them into a list of list items (i.e. DayItem or MonthItem).
 */
export const transformGCalEventsToListItems = (events: GCalEvent[]): EventItemShape[] => {
    const monthsSeen = new Set();

    return events.reduce((runningEventsArr, event) => {
        const eventDateTime = extractEventDateTime(event);
        const month = eventDateTime.format('MMMM');
        const year = eventDateTime.year();
        const description = extractEventDescription(event);

        const nextEventsArr = [];
        if (!monthsSeen.has(`${month} ${year}`)) {
            monthsSeen.add(`${month} ${year}`);
            nextEventsArr.push(createListItem('month', { month, year }));
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

        return [...runningEventsArr, ...nextEventsArr];
    }, []);
};

export const transformCachedEventsToListItems = (events: CachedEvent[]) => {
    const monthsSeen = new Set();

    return events.reduce((runningEventsArr, event) => {
        let eventDateTime = moment(event.dateTime);
        if (event.timezone) { eventDateTime = eventDateTime.tz(event.timezone); }
        const month = eventDateTime.format('MMMM');
        const year = eventDateTime.year();
        const description = extractEventDescription(event);

        const nextEventsArr = [];
        if (!monthsSeen.has(`${month} ${year}`)) {
            monthsSeen.add(`${month} ${year}`);
            nextEventsArr.push(createListItem('month', { month, year }));
        }

        nextEventsArr.push(createListItem('day', {
            id: event.UUID,
            name: event.name,
            dateTime: eventDateTime,
            collaborators: description.collaborators,
            eventType: description.type.value,
            location: event.location,
            program: description.program,
        }));

        return [...runningEventsArr, ...nextEventsArr];
    }, []);
};
