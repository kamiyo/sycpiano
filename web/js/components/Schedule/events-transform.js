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

/**
 * Transforms events returned by the Calendar API into event items the EventList can actually render.
 * This function assumes that the events are sorted in order of startTime.
 *
 * @param {array<object>} events - Array of object representation of Google Calendar events
 * @return {array<object>} Array of object representations of event items.
 */
export function transformToEventItems(events) {
    const eventItems = [];
    const monthsSeen = new Set();
    _.forEach(events, (event, index) => {
        const eventDateTime = _extractEventDateTime(event);
        const month = eventDateTime.format('MMMM');
        if (!monthsSeen.has(month)) {
            monthsSeen.add(month);
            eventItems.push({type: 'month', month: month});
        }
        const description = _extractEventDescription(event);
        eventItems.push({
            type: 'day',
            name: event.summary,
            day: parseInt(eventDateTime.format('D')),
            time: eventDateTime.format('h:mm z'),
            program: description.program,
            collaborators: description.collaborators,
            eventType: description.type.value,
        });
    });
    return eventItems;
}
