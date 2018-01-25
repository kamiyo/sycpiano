import { default as moment } from 'moment-timezone';

import createListItem from 'src/components/Schedule/createListItem';
import { CachedEvent, DayItemInputShape, EventItemShape, GCalEvent } from 'src/components/Schedule/types';

const GOOGLE_MAPS_SEARCH_URL = 'https://www.google.com/maps/search/?api=1';

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
const extractEventDescription = (event: GCalEvent) => {
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
        const monthYearString = `${month} ${year}`;
        if (!monthsSeen.has(monthYearString)) {
            monthsSeen.add(monthYearString);
            const monthMoment = moment(monthYearString, 'MMMM YYYY');
            nextEventsArr.push(createListItem('month', { dateTime: monthMoment, month, year }));
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

export const transformCachedEventsToListItems = (events: CachedEvent[], monthsSeen: Set<string>): EventItemShape[] => {

    return events.reduce((runningEventsArr, event) => {
        let eventDateTime = moment(event.dateTime);
        if (event.timezone) { eventDateTime = eventDateTime.tz(event.timezone); }
        const month = eventDateTime.format('MMMM');
        const year = eventDateTime.year();

        const nextEventsArr = [];
        const monthYearString = `${month} ${year}`;
        if (!monthsSeen.has(monthYearString)) {
            monthsSeen.add(monthYearString);
            const monthMoment = moment(monthYearString, 'MMMM YYYY');
            nextEventsArr.push(createListItem('month', { dateTime: monthMoment, month, year }));
        }

        nextEventsArr.push(createListItem('day', {
            id: event.id,
            name: event.name,
            dateTime: eventDateTime,
            collaborators: event.collaborators,
            eventType: event.type,
            location: event.location,
            program: event.pieces,
            website: event.website,
        } as DayItemInputShape));

        return [...runningEventsArr, ...nextEventsArr];
    }, []);
};

export const getGoogleMapsSearchUrl = (query: string) => `
    ${GOOGLE_MAPS_SEARCH_URL}&query=${encodeURIComponent(query)}
`;
