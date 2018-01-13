import * as moment from 'moment';

import axios from 'axios';
import * as Promise from 'bluebird';

import { CalendarAttributes, CalendarInstance, CalendarModel, CollaboratorModel, ModelMap, PieceModel } from 'types';

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
        const calendarModel: CalendarModel = models.calendar;
        const pieceModel: PieceModel = models.piece;
        const collaboratorModel: CollaboratorModel = models.collaborator;
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
                type: type.value,
                program,
                collaborators,
            };
        });

        items.forEach(async (item) => {
            let currentItem: string;
            try {
                const { program, collaborators, ...attributes } = item;

                const itemInstance: CalendarInstance = await calendarModel.create(attributes as CalendarAttributes);
                const pieceInstances = await Promise.map(program, async (piece: string) => {
                    currentItem = piece;
                    const [pieceInstance] = await pieceModel.findOrCreate({
                        where: { piece },
                    });
                    return pieceInstance;
                });

                await itemInstance.setPieces(pieceInstances);
                const collaboratorInstances = await Promise.map(collaborators, async (collaborator: string) => {
                    currentItem = collaborator;
                    const [collaboratorInstance] = await collaboratorModel.findOrCreate({
                        where: { name: collaborator },
                    });
                    return collaboratorInstance;
                });
                await itemInstance.setCollaborators(collaboratorInstances);
            } catch (e) {
                console.log(`currentItem: ${currentItem}`);
                console.log(e);
            }
        });
    } catch (e) {
        console.log(e);
        return;
    }
};

export const down = async (models: ModelMap) => {
    return models.calendar.destroy({ where: {}, cascade: true });
};
