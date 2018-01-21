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
        console.log(e);
        console.log('======Error parsing event description JSON======');
        console.log(event.description);
        return {};
    }
};

const programToPieceModel = (program: string) => {
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
                const pieceInstances = await Promise.mapSeries(program, async (composerPiece: string) => {
                    currentItem = composerPiece;
                    const { composer, piece } = programToPieceModel(composerPiece);
                    console.log(composer, piece);
                    const [ pieceInstance ] = await pieceModel.findOrCreate({
                        where: { composer, piece },
                    });
                    return pieceInstance;
                });
                await itemInstance.setPieces(pieceInstances);
                const collaboratorInstances = await Promise.mapSeries(collaborators, async (collaborator: string) => {
                    currentItem = collaborator;
                    const [ name, instrument = null ] = collaborator.split(', ');
                    const [collaboratorInstance] = await collaboratorModel.findOrCreate({
                        where: { name, instrument },
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
    await models.calendar.destroy({ where: {}, cascade: true });
    await models.collaborator.destroy({ where: {}, cascade: true });
    await models.piece.destroy({ where: {}, cascade: true });
    return;
};
