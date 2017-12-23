import * as moment from 'moment';

import axios from 'axios';

import { QueryInterface } from 'sequelize';

const calAPIKey = 'AIzaSyC8YGSlCPlqT-MAHN_LvM2T3K-ltaiqQMI';
const calendarId = 'c7dolt217rdb9atggl25h4fspg@group.calendar.google.com';
const uriEncCalId = encodeURIComponent(calendarId);

type Moment = moment.Moment;

function getCalendarEvents(timeMin = moment(0)) {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${uriEncCalId}/events`;
    return axios.get(url, {
        params: {
            orderBy: 'startTime',
            singleEvents: true,
            timeMin: timeMin.format(),
            key: calAPIKey,
        },
    });
}

interface GCalEvent {
    readonly description: any;
    readonly id: string;
    readonly location: string;
    readonly start: {
        readonly dateTime?: Moment;
        readonly date?: Moment;
        readonly timeZone?: string;
    };
    readonly summary: string;
    readonly [key: string]: any; // other params
}

const extractEventDescription = (event: GCalEvent) => {
    try {
        return JSON.parse(event.description);
    } catch (e) {
        return {};
    }
};

export const up = async (queryInterface: QueryInterface) => {
    try {
        const response = await getCalendarEvents();
        const items = response.data.items.map((event: GCalEvent) => {
            const dateTime = event.start.dateTime ? event.start.dateTime : event.start.date;
            const timezone = event.start.dateTime ? event.start.timeZone : '';
            const {
                collaborators,
                type,
                program,
            } = extractEventDescription(event);

            const id = event.id;
            const name = event.summary;
            const location = event.location;

            console.log(program, type);
            return {
                id,
                name,
                dateTime,
                timezone,
                location,
                collaborators: JSON.stringify(collaborators),
                type: JSON.stringify(type),
                program: JSON.stringify(program),
            };
        });
        return queryInterface.bulkInsert('calendar', items);
    } catch (e) {
        console.log(e);
        return;
    }
};

export const down = async (queryInterface: QueryInterface) => {
    return queryInterface.bulkDelete('calendar', null);
};
