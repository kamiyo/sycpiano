import * as moment from 'moment';

import axios from 'axios';
import * as Promise from 'bluebird';

import { CalendarAttributes, CalendarInstance, CalendarModel, CollaboratorModel, ModelMap, PieceModel, TokenModel } from 'types';

const calAPIKey = 'AIzaSyC8YGSlCPlqT-MAHN_LvM2T3K-ltaiqQMI';
const calendarId = 'c7dolt217rdb9atggl25h4fspg@group.calendar.google.com';
const uriEncCalId = encodeURIComponent(calendarId);

type Moment = moment.Moment;

function getCalendarEvents(nextPageToken: string = null, syncToken: string = null) {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${uriEncCalId}/events`;
    return axios.get(url, {
        params: {
            singleEvents: true,
            key: calAPIKey,
            pageToken: nextPageToken,
            syncToken,
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
        let responseItems: any[] = [];
        let nextPageToken: string;
        let syncToken: string;
        do {
            const response = await getCalendarEvents(nextPageToken, syncToken);
            responseItems = responseItems.concat(response.data.items);
            nextPageToken = response.data.nextPageToken;
            syncToken = response.data.nextSyncToken;
        } while (!!nextPageToken && !syncToken);
        console.log(syncToken);
        const calendarModel: CalendarModel = models.calendar;
        const pieceModel: PieceModel = models.piece;
        const collaboratorModel: CollaboratorModel = models.collaborator;
        const tokenModel: TokenModel = models.token;
        const items: Array<{
            [key: string]: any,
        }> = responseItems.map((event: GCalEvent) => {
            const dateTime = event.start.dateTime ? event.start.dateTime : event.start.date;
            const timezone = event.start.dateTime ? event.start.timeZone : '';
            const {
                collaborators,
                type,
                program,
                website,
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
                website,
                type: type.value,
                program,
                collaborators,
            };
        });

        await Promise.each(items, async (item) => {
            let currentItem: string;
            try {
                const { program, collaborators, ...attributes } = item;

                const itemInstance: CalendarInstance = await calendarModel.create(attributes as CalendarAttributes);
                await Promise.each(program, async (composerPiece: string, index: number) => {
                    currentItem = composerPiece;
                    const { composer, piece } = programToPieceModel(composerPiece);
                    console.log(composer, piece);
                    const [ pieceInstance ] = await pieceModel.findOrCreate({
                        where: { composer, piece },
                    });
                    await itemInstance.addPiece(pieceInstance, { through: { order: index }});
                });
                await Promise.each(collaborators, async (collaborator: string, index: number) => {
                    currentItem = collaborator;
                    const [ name, instrument = null ] = collaborator.split(', ');
                    const [collaboratorInstance] = await collaboratorModel.findOrCreate({
                        where: { name, instrument },
                    });
                    await itemInstance.addCollaborator(collaboratorInstance, { through: { order: index }}) ;
                });
            } catch (e) {
                console.log(`currentItem: ${currentItem}`);
                console.log(e);
            }
        });

        await tokenModel.create({ id: 'calendar_sync', token: syncToken, expires: null });
    } catch (e) {
        console.log(e);
        return;
    }
};

export const down = async (models: ModelMap) => {
    await models.calendar.destroy({ where: {}, cascade: true });
    await models.collaborator.destroy({ where: {}, cascade: true });
    await models.piece.destroy({ where: {}, cascade: true });
    await models.token.destroy({ where: {}, cascade: true });
    return;
};
