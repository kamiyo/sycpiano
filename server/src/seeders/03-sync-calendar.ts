import * as Promise from 'bluebird';

import { extractEventDescription, getCalendarEvents } from '../gapi/calendar';

import {
    CalendarAttributes,
    CalendarInstance,
    CalendarModel,
    CollaboratorAttributes,
    CollaboratorModel,
    GCalEvent,
    ModelMap,
    PieceAttributes,
    PieceModel,
    TokenModel,
} from 'types';

export const up = async (models: ModelMap) => {
    try {
        let responseItems: GCalEvent[] = [];
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
        }> = responseItems.map((event) => {
            const dateTime = event.start.dateTime ? event.start.dateTime : event.start.date;
            const timezone = event.start.dateTime ? event.start.timeZone : '';
            const {
                collaborators,
                pieces,
                type,
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
                type,
                pieces,
                collaborators,
            };
        });

        await Promise.each(items, async (item) => {
            let currentItem: any;
            try {
                const { pieces, collaborators, ...attributes } = item;

                const itemInstance: CalendarInstance = await calendarModel.create(attributes as CalendarAttributes);
                currentItem = itemInstance;
                await Promise.each(pieces, async ({ composer, piece }: PieceAttributes, index: number) => {
                    currentItem = { composer, piece };
                    const [ pieceInstance ] = await pieceModel.findOrCreate({
                        where: { composer, piece },
                    });
                    await itemInstance.addPiece(pieceInstance, { through: { order: index }});
                });
                await Promise.each(collaborators, async ({ name, instrument }: CollaboratorAttributes, index: number) => {
                    currentItem = { name, instrument };
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
