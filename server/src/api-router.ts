import * as express from 'express';
import * as moment from 'moment-timezone';

import db from './models';
const models = db.models;
const sequelize = db.sequelize;

const apiRouter = express.Router();

import Sequelize from 'sequelize';
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
            [betweenEvents, futureEvents] = await Promise.all([
                getEventsBetween(nowMoment.format(), date, 'ASC'),
                getEventsAfter(date, 5),
            ]);
            response = [...betweenEvents, ...futureEvents];
            break;
        case PAST:
            [betweenEvents, pastEvents] = await Promise.all([
                getEventsBetween(date, nowMoment.format(), 'DESC'),
                getEventsBefore(date, 5),
            ]);
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

apiRouter.use(/\/calendar/, calendarRouter);

const getMusicInstancesOfType = (type: string) => {
    const order = (type === 'videogame' || type === 'composition') ?
        [
            ['year', 'DESC'],
            [models.musicFile, 'name', 'ASC'],
        ] :
        [
            [sequelize.fn('substring', sequelize.col('composer'), '([^\\s]+)\\s?(?:\\(.*\\))?$'), 'ASC'] as any,
            [models.musicFile, 'name', 'ASC'],
        ];

    return models.music.findAll({
        where: {
            type,
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
        },
        include: [{
            model: models.musicFile,
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
        }],
        order,
    });
};

apiRouter.get('/music', async (_, res) => {
    const [concerto, solo, chamber, composition, videogame] = await Promise.all([
        getMusicInstancesOfType('concerto'),
        getMusicInstancesOfType('solo'),
        getMusicInstancesOfType('chamber'),
        getMusicInstancesOfType('composition'),
        getMusicInstancesOfType('videogame'),
    ]);

    res.json({ concerto, solo, chamber, composition, videogame });
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
