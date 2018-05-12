import axios from 'axios';
import * as moment from 'moment';
import { getToken } from './oauth';

import { GCalEvent } from '../types';

const timeZoneKey = 'AIzaSyDEs770cNo7P5z0Szrysv0T5c-l9HT3cnc';
const calendarId = (process.env.NODE_ENV === 'production' && process.env.SERVER_ENV !== 'test')
    ? 'qdoiu1uovuc05c4egu65vs9uck@group.calendar.google.com'
    : 'c7dolt217rdb9atggl25h4fspg@group.calendar.google.com';
const uriEncCalId = encodeURIComponent(calendarId);

export const getCalendarSingleEvent = async (id: string) => {
    const token = await getToken();
    const url = `https://www.googleapis.com/calendar/v3/calendars/${uriEncCalId}/events/${id}`;
    return axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getCalendarEvents = async (nextPageToken: string = null, syncToken: string = null) => {
    const token = await getToken();
    const url = `https://www.googleapis.com/calendar/v3/calendars/${uriEncCalId}/events`;
    return axios.get(url, {
        params: {
            singleEvents: true,
            pageToken: nextPageToken,
            syncToken,
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const deleteCalendarEvent = async (id: string) => {
    const token = await getToken();
    const url = `https://www.googleapis.com/calendar/v3/calendars/${uriEncCalId}/events/${id}`;
    return axios.delete(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export interface GoogleCalendarParams {
    id?: string;
    summary: string;
    description: string;
    location: string;
    startDatetime: moment.Moment;
    timeZone: string;
    allDay: boolean;
    endDate: moment.Moment;
}

export const createCalendarEvent = async ({
    id,
    summary,
    description,
    location,
    startDatetime,
    timeZone,
    allDay,
    endDate,
}: GoogleCalendarParams) => {
    const token = await getToken();
    const url = `https://www.googleapis.com/calendar/v3/calendars/${uriEncCalId}/events`;
    const eventResource = {
        id,
        summary,
        description,
        location,
        start: (allDay ? { date: startDatetime.format('YYYY-MM-DD') } : { dateTime: startDatetime.format(), timeZone }),
        end: (endDate ? { date: endDate.format('YYYY-MM-DD') } : { dateTime: startDatetime.add({ hours: 2 }).format(), timeZone }),
    };
    return axios.post(url, eventResource, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const updateCalendar = async ({
    id,
    summary,
    description,
    location,
    startDatetime,
    timeZone,
    allDay,
    endDate,
}: GoogleCalendarParams) => {
    const token = await getToken();
    const url = `https://www.googleapis.com/calendar/v3/calendars/${uriEncCalId}/events/${id}`;
    const eventResource = {
        summary,
        description,
        location,
        start: (allDay ? { date: startDatetime.format('YYYY-MM-DD') } : { dateTime: startDatetime.format(), timeZone }),
        end: (endDate ? { date: endDate.format('YYYY-MM-DD') } : { dateTime: startDatetime.add({ hours: 2 }).format(), timeZone }),
    };
    return axios.put(url, eventResource, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const extractEventDescription = (event: GCalEvent) => {
    try {
        return JSON.parse(event.description);
    } catch (e) {
        console.log(e);
        console.log('======Error parsing event description JSON======');
        console.log(event.description);
        return {};
    }
};

// export const programToPieceModel = (program: string) => {
//     const out = {
//         composer: '',
//         piece: '',
//     };
//     // check if TBD
//     if (!program.length || program.toLowerCase() === 'tbd') {
//         return out;
//     }

//     // check if has semicolon (separating composer from piece)
//     let index = program.indexOf(':');
//     if (index !== -1) {
//         const [composer, piece = ''] = program.split(':');
//         out.composer = composer;
//         out.piece = piece;
//         return out;
//     }

//     index = program.indexOf(' ');
//     if (index !== -1) {
//         const composer = program.substr(0, index);
//         const piece = program.substring(index + 1);
//         out.composer = composer;
//         out.piece = piece;
//         return out;
//     }

//     out.composer = program;
//     return out;
// };

export const getLatLng = async (address: string) => {
    const geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    try {
        const response = await axios.get(geocodeUrl, {
            params: {
                address,
                key: timeZoneKey,
            },
        });
        return {
            latlng: response.data.results[0].geometry.location,
            formattedAddress: response.data.results[0].formattedAddress,
        };
    } catch (e) {
        console.log(e);
    }
};

export const getTimeZone = async (lat: number, lng: number, timestamp: moment.Moment = moment()) => {
    const loc = `${lat.toString()},${lng.toString()}`;
    const url = `https://maps.googleapis.com/maps/api/timezone/json`;
    try {
        const response = await axios.get(url, {
            params: {
                location: loc,
                timestamp: timestamp.unix(),
                key: timeZoneKey,
            },
        });
        return response.data.timeZoneId;
    } catch (e) {
        console.log(e);
    }
};
