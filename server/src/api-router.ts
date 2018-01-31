import * as express from 'express';
import * as moment from 'moment-timezone';

import * as Promise from 'bluebird';

import { extractEventDescription, getCalendarEvents, programToPieceModel } from './gapi/calendar';

import db from './models/index';
const models = db.models;

const apiRouter = express.Router();

import Sequelize from 'sequelize';
import {
    CalendarAttributes,
    CalendarInstance,
    CalendarModel,
    CollaboratorInstance,
    CollaboratorModel,
    PieceInstance,
    PieceModel,
    TokenModel,
} from 'types';
const { gt, lt } = Sequelize.Op;

apiRouter.get('/acclaims', (req, res) => {
    // TODO: add order-by http://docs.sequelizejs.com/en/v3/docs/querying/
    const params: Sequelize.FindOptions<{}> = {
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
        },
    };
    if (req.query.hasOwnProperty('count')) {
        params.limit = req.params.count;
    }
    models.acclaim.findAll(params).then((object) => res.json(object));
});

// Excludes the date specified (less than)
function getEventsBefore(before: string, limit: number) {
    return models.calendar.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
        },
        include: [
            {
                model: models.collaborator,
                attributes: {
                    exclude: ['id', 'createdAt', 'updatedAt'],
                },
                through: {
                    attributes: ['order'],
                },
                include: [{
                    model: models.calendarCollaborator,
                    attributes: ['order'],
                }],
            },
            {
                model: models.piece,
                attributes: {
                    exclude: ['id', 'createdAt', 'updatedAt'],
                },
                through: {
                    attributes: ['order'],
                },
                include: [{
                    model: models.calendarPiece,
                    attributes: ['order'],
                }],
            },
        ],
        where: {
            dateTime: {
                [lt]: before,
            },
        },
        limit,
        order: [
            ['dateTime', 'DESC'],
            [models.collaborator, models.calendarCollaborator, 'order', 'ASC'],
            [models.piece, models.calendarPiece, 'order', 'ASC'],
        ],
    });
}

// Includes the date specified (greater than)
function getEventsAfter(after: string, limit: number) {
    return models.calendar.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
        },
        include: [
            {
                model: models.collaborator,
                attributes: {
                    exclude: ['id', 'createdAt', 'updatedAt'],
                },
                through: {
                    attributes: [],
                },
                include: [{
                    model: models.calendarCollaborator,
                    attributes: ['order'],
                }],
            },
            {
                model: models.piece,
                attributes: {
                    exclude: ['id', 'createdAt', 'updatedAt'],
                },
                through: {
                    attributes: [],
                },
                include: [{
                    model: models.calendarPiece,
                    attributes: ['order'],
                }],
            },
        ],
        where: {
            dateTime: {
                [gt]: after,
            },
        },
        limit,
        order: [
            ['dateTime', 'ASC'],
            [models.collaborator, models.calendarCollaborator, 'order', 'ASC'],
            [models.piece, models.calendarPiece, 'order', 'ASC'],
        ],
    });
}

// The interval is open on the less-than side.
function getEventsBetween(start: string, end: string, order: 'ASC' | 'DESC') {
    return models.calendar.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
        },
        include: [
            {
                model: models.collaborator,
                attributes: {
                    exclude: ['id', 'createdAt', 'updatedAt'],
                },
                through: {
                    attributes: ['order'],
                },
                include: [{
                    model: models.calendarCollaborator,
                    attributes: ['order'],
                }],
            },
            {
                model: models.piece,
                attributes: {
                    exclude: ['id', 'createdAt', 'updatedAt'],
                },
                through: {
                    attributes: ['order'],
                },
                include: [{
                    model: models.calendarPiece,
                    attributes: ['order'],
                }],
            },
        ],
        where: {
            dateTime: {
                [gt]: start,
                [lt]: end,
            },
        },
        order: [
            ['dateTime', order],
            [models.collaborator, models.calendarCollaborator, 'order', 'ASC'],
            [models.piece, models.calendarPiece, 'order', 'ASC'],
        ],
    });
}

const AFTER = 2;
const FUTURE = 1;
const ALL = 0;
const PAST = -1;
const BEFORE = -2;

const calendarRouter = express.Router({ mergeParams: true });

calendarRouter.get('/', async (req, res) => {
    const model = models.calendar;

    const limit = req.query.limit;
    const date = req.query.date;
    const before = req.query.before;
    const after = req.query.after;

    let type;
    const dateMoment = moment(date);
    const nowMoment = moment().startOf('day');

    if (!date) {
        if (before) {
            type = BEFORE;
        } else if (after) {
            type = AFTER;
        } else {
            type = ALL;
        }
    } else if (dateMoment.isSameOrAfter(nowMoment, 'day')) {
        type = FUTURE;
    } else {
        type = PAST;
    }

    let response;
    let betweenEvents;
    let futureEvents;
    let pastEvents;
    switch (type) {
        case FUTURE:
            betweenEvents = await getEventsBetween(nowMoment.format(), date, 'ASC');
            futureEvents = await getEventsAfter(date, 5);
            response = [...betweenEvents, ...futureEvents];
            break;
        case PAST:
            betweenEvents = await getEventsBetween(date, nowMoment.format(), 'DESC');
            pastEvents = await getEventsBefore(date, 5);
            response = [...betweenEvents.reverse(), ...pastEvents];
            break;
        case ALL:
            response = await model.findAll();
            break;
        case AFTER:
            response = await getEventsAfter(after, limit);
            break;
        case BEFORE:
            response = await getEventsBefore(before, limit);
            break;
        default:
            break;
    }

    res.json(response);
});

calendarRouter.post('/watch', async (req, res) => {
    console.log('watch');
    console.log(req.headers);

    const tokenModel: TokenModel = models.token;
    const syncToken = await tokenModel.findById('calendar_sync');

    try {
        let responseItems: any[] = [];
        let nextPageToken: string;
        let newSyncToken: string;
        do {
            const response = await getCalendarEvents(nextPageToken, syncToken.token);
            responseItems = responseItems.concat(response.data.items);
            nextPageToken = response.data.nextPageToken;
            newSyncToken = response.data.nextSyncToken;
        } while (!!nextPageToken && !newSyncToken);
        const calendarModel: CalendarModel = models.calendar;
        const pieceModel: PieceModel = models.piece;
        const collaboratorModel: CollaboratorModel = models.collaborator;

        console.log(responseItems);

        await Promise.each(responseItems, async (event) => {
            // delete
            if (!event.description && event.status === 'cancelled') {
                await calendarModel.destroy({
                    where: {
                        id: event.id,
                    },
                });
                return;
            }

            const dateTime = event.start.dateTime ? event.start.dateTime : event.start.date;
            const timezone = event.start.dateTime ? event.start.timeZone : '';
            const {
                collaborators,
                type: {
                    value: type,
                },
                program,
                website,
            } = extractEventDescription(event);

            const id = event.id;
            const name = event.summary;
            const location = event.location;

            const attributes: CalendarAttributes = {
                name,
                dateTime,
                timezone,
                location,
                website,
                type,
            };

            let currentItem: string;
            try {
                let itemInstance: CalendarInstance = await calendarModel.findById(id);
                if (itemInstance) {
                    await itemInstance.update(attributes);

                    const pieceInstances = itemInstance.getPieces();
                    await Promise.each(pieceInstances, async (pieceInstance: PieceInstance) => {
                        itemInstance.removePiece(pieceInstance);
                        const pieceAssociations = await pieceInstance.countCalendars();
                        if (pieceAssociations === 0) {
                            await pieceInstance.destroy();
                        }
                    });
                    const collaboratorInstances = itemInstance.getCollaborators();
                    await Promise.each(collaboratorInstances, async (collaboratorInstance: CollaboratorInstance) => {
                        itemInstance.removeCollaborator(collaboratorInstance);
                        const collaboratorAssociations = await collaboratorInstance.countCalendars();
                        if (collaboratorAssociations === 0) {
                            await collaboratorInstance.destroy();
                        }
                    });
                } else {
                    itemInstance = await calendarModel.create({ id, ...attributes } as CalendarAttributes);
                }

                await Promise.each(program, async (composerPiece: string, index: number) => {
                    currentItem = composerPiece;
                    const { composer, piece } = programToPieceModel(composerPiece);
                    console.log(composer, piece);
                    const [pieceInstance] = await pieceModel.findOrCreate({
                        where: { composer, piece },
                    });
                    await itemInstance.addPiece(pieceInstance, { through: { order: index } });
                });
                await Promise.each(collaborators, async (collaborator: string, index: number) => {
                    currentItem = collaborator;
                    const [pieceName, instrument = null] = collaborator.split(', ');
                    const [collaboratorInstance] = await collaboratorModel.findOrCreate({
                        where: { name: pieceName, instrument },
                    });
                    await itemInstance.addCollaborator(collaboratorInstance, { through: { order: index } });
                });
            } catch (e) {
                console.log(`currentItem: ${currentItem}`);
                console.log(e);
            }
        });

        await syncToken.update({ token: newSyncToken });
    } catch (e) {
        console.log(e);
        return;
    }

    res.status(201).end();
});

apiRouter.use(/\/calendar/, calendarRouter);

apiRouter.get('/music', async (_, res) => {
    const model = models.music;
    const response = await model.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
        },
        include: [{
            model: models.musicFile,
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
        }],
        order: [
            ['composer', 'ASC'],
            [models.musicFile, 'name', 'ASC'],
        ],
    });
    res.json(response);
});

apiRouter.get('/photos', async (_, res) => {
    const model = models.photo;
    const response = await model.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
        },
    });
    res.json(response);
});

export const ApiRouter = apiRouter;
