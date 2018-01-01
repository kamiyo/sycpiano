import * as moment from 'moment';

import axios from 'axios';

import { ModelMap } from 'types';

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

export const up = async (models: ModelMap) => {
    try {
        const response = await getCalendarEvents();
        const model = models.calendar;
        const items: Array<{
            [key: string]: any,
        }> = response.data.items.map((event: GCalEvent) => {
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

            return {
                id,
                name,
                dateTime,
                timezone,
                location,
                calendarPieces: {
                    pieces: program.map((piece: string) => ({ piece })),
                },
                calendarCollaborators: {
                    collaborators: collaborators.map((collab: string) => ({ name: collab })),
                },
                type: type.value,
            };
        });
        items.forEach(async (item) => {
            console.log(item);
            await model.create(item, {
                include: [{
                    model: models.calendarPiece,
                    include: [ models.piece ],
                }, {
                    model: models.calendarCollaborator,
                    include: [ models.collaborator ],
                }],
            });
        });
    } catch (e) {
        console.log(e);
        return;
    }
};

export const down = async (models: ModelMap) => {
    return models.calendar.destroy({ where: {}, cascade: true });
};
