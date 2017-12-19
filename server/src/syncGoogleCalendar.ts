import moment from 'moment-timezone';
import sequelizer from './sequelizer';
import initDB from './initDB';

import axios from 'axios';

import models from './models/index';
import { Model } from 'sequelize';
const importModels = models.importModels;

const calAPIKey = 'AIzaSyC8YGSlCPlqT-MAHN_LvM2T3K-ltaiqQMI';
const calendarId = 'c7dolt217rdb9atggl25h4fspg@group.calendar.google.com';
const uriEncCalId = encodeURIComponent(calendarId);

type Moment = moment.Moment;

function getCalendarEvents(timeMin = moment(0)) {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${uriEncCalId}/events`;
    console.log(url);
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

async function main () {
    try {
        await initDB();
        const model: Model<{}, {}> = importModels(sequelizer)['Calendar'];
        await model.destroy({ where: {}, truncate: true });
        const response = await getCalendarEvents();
        const items = response.data.items.map((event: GCalEvent) => {
            const dateTime = event.start.dateTime ? event.start.dateTime : event.start.date;
            const timezone = event.start.dateTime ? event.start.timeZone : '';
            const {
                collaborators,
                type,
                program,
            } = extractEventDescription(event);

            const UUID = event.id;
            const name = event.summary;
            const location = event.location;
            return {
                UUID,
                name,
                dateTime,
                timezone,
                location,
                collaborators,
                type,
                program,
            };
        });
        await model.bulkCreate(items);
        console.log('successfully created');
        process.exit();
    } catch (e) {
        console.log(e);
        process.exit();
    }
};

main();