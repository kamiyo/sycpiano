import axios from 'axios';
import moment from 'moment';

const tzAPIKey = 'AIzaSyDnJI7CLrfcEDmFG6_AB0PcVXjzqN1nDVM';
const calAPIKey = 'AIzaSyB1g_4E0UTqwX0TxezROJiNj3cAY0rr16w';
const calendarId = 'c7dolt217rdb9atggl25h4fspg@group.calendar.google.com';
const uriEncCalId = encodeURIComponent(calendarId);

const mapsApiKey = 'AIzaSyCrouLkU4nuAFy1CRBU4qkAtxTXyjvrcFQ';
export const googleMapsUrl = `https://maps.googleapis.com/maps/api/js?v=3.28&libraries=places,geometry&key=${mapsApiKey}`;

/**
 * NOTE: All GoogleAPI functions return promises.
 */
class GoogleAPI {
    createEvent(
        summary,
        description,
        location,
        startDatetime,
        endDatetime,
        timezone,
        timeTBD,
        accessToken
    ) {
        const url = `https://www.googleapis.com/calendar/v3/calendars/${uriEncCalId}/events`;
        const eventResource = {
            summary: summary,
            description: description,
            location: location,
            start: (timeTBD) ? {date: startDatetime.format('YYYY-MM-DD')} : {dateTime: startDatetime.format(), timeZone: timezone},
            end: (timeTBD) ? {date: endDatetime.format('YYYY-MM-DD')} : {dateTime: endDatetime.format(), timeZone: timezone},
        };
        return axios.post(url, eventResource, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
    }

    updateEvent(
        eventId,
        summary,
        description,
        location,
        startDatetime,
        endDatetime,
        timezone,
        timeTBD,
        accessToken
    ){
        console.log(startDatetime.format());
        const url = `https://www.googleapis.com/calendar/v3/calendars/${uriEncCalId}/events/${eventId}`;
        const eventResource = {
            summary: summary,
            description: description,
            location: location,
            start: (timeTBD) ? {date: startDatetime.format('YYYY-MM-DD')} : {dateTime: startDatetime.format(), timeZone: timezone},
            end: (timeTBD) ? {date: endDatetime.format('YYYY-MM-DD')} : {dateTime: endDatetime.format(), timeZone: timezone},
        };
        return axios.put(url, eventResource, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
    }

    geocode(address) {
        const url = 'https://maps.googleapis.com/maps/api/geocode/json';
        return axios.get(url, { params: { address: address, key: tzAPIKey }});
    }

    /**
     * Gets Google Calendar events with start times after timeMin
     *
     * @param {moment} timeMin - the lower bound for end time of events to be returned.
     */
    getCalendarEvents(timeMin = moment()) {
        const url = `https://www.googleapis.com/calendar/v3/calendars/${uriEncCalId}/events`;
        return axios.get(url, {
            params: {
                orderBy: 'startTime',
                singleEvents: true,
                timeMin: timeMin.format(),
                key: calAPIKey,
            }
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

export let googleAPI = new GoogleAPI();
