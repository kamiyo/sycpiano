import moment from 'moment-timezone';

import createListItem from '@/js/components/Schedule/createListItem.js';

/**
 * Takes an event resource as returned by the Calendar API, and extracts the
 * event's start dateTime into a moment object.
 * @param  {object} event
 * @return {moment}
 */
const _extractEventDateTime = (event) => {
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
const _extractEventDescription = (event) => {
    try {
        return JSON.parse(event.description);
    } catch (e) {
        return {};
    }
}

/**
 * Takes gcal events, and processes them into a list of list items (i.e. DayItem or MonthItem).
 */
export const transformGCalEventsToListItems = (events) => {
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
};
