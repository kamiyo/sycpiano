import axios from 'axios';
import { getToken } from './oauth';

import { GCalEvent } from '../types';

// const calAPIKey = 'AIzaSyC8YGSlCPlqT-MAHN_LvM2T3K-ltaiqQMI';
const calendarId = 'c7dolt217rdb9atggl25h4fspg@group.calendar.google.com';
const uriEncCalId = encodeURIComponent(calendarId);

export const getCalendarEvents = async (nextPageToken: string = null, syncToken: string = null) => {
    const token = await getToken();
    const url = `https://www.googleapis.com/calendar/v3/calendars/${uriEncCalId}/events`;
    return axios.get(url, {
        params: {
            singleEvents: true,
            access_token: token,
            pageToken: nextPageToken,
            syncToken,
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

export const programToPieceModel = (program: string) => {
    const out = {
        composer: '',
        piece: '',
    };
    // check if TBD
    if (!program.length || program.toLowerCase() === 'tbd') {
        return out;
    }

    // check if has semicolon (separating composer from piece)
    let index = program.indexOf(':');
    if (index !== -1) {
        const [ composer, piece = '' ] = program.split(':');
        out.composer = composer;
        out.piece = piece;
        return out;
    }

    index = program.indexOf(' ');
    if (index !== -1) {
        const composer = program.substr(0, index);
        const piece = program.substring(index + 1);
        out.composer = composer;
        out.piece = piece;
        return out;
    }

    out.composer = program;
    return out;
};
