import axios from 'axios';

const tzAPIKey = 'AIzaSyDnJI7CLrfcEDmFG6_AB0PcVXjzqN1nDVM';
const calAPIKey = 'AIzaSyB1g_4E0UTqwX0TxezROJiNj3cAY0rr16w';
const calendarId = 'c7dolt217rdb9atggl25h4fspg@group.calendar.google.com';
const encodedCalendarId = encodeURIComponent(calendarId);

class GoogleAPI {
    createEvent(
        summary,
        description,
        location,
        startDatetime,
        endDatetime,
        timezone,
        accessToken
    ) {
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodedCalendarId}/events`;
        const eventResource = {
            summary: summary,
            description: description,
            location: location,
            start: {dateTime: startDatetime, timeZone: timezone},
            end: {dateTime: endDatetime, timeZone: timezone},
        };
        return axios.post(url, eventResource, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
    }

    geocode(address) {
        const url = `https://maps.googleapis.com/maps/api/geocode/json`;
        return axios.get(url, {params: {address: address, key: tzAPIKey}});
    }

    getEvents(accessToken) {
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodedCalendarId}/events`;
        return axios.get(url, {
            params: {
                orderBy: 'startTime',
                singleEvents: true,
                fields: 'items',
            },
            headers: {
                'Authorization: Bearer': accessToken,
            },
        });
    }

    /**
     * Grabs the timezone associated with the given geocoordinates.
     *
     * @param {number} lat
     * @param {number} long
     * @param {number} timestamp - Seconds since midnight, January 1, 1970 UTC.
     *                             Used for determining whether DST is active.
     */
    getTimezone(lat, long, timestamp) {
        const loc = `${lat.toString()},${long.toString()}`;
        const url = `https://maps.googleapis.com/maps/api/timezone/json`;
        return axios.get(url, {
            params: {
                location: loc,
                timestamp: timestamp.toString(),
                key: tzAPIKey,
            }
        });
    }
}

export default new GoogleAPI();
