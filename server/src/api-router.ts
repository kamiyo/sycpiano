import * as express from 'express';
import * as moment from 'moment-timezone';

import db from './models';
const models = db.models;
const sequelize = db.sequelize;

const apiRouter = express.Router();

import Sequelize from 'sequelize';
import { BioInstance, CalendarInstance } from 'types';
const { and, eq, gt, lt, or } = Sequelize.Op;

const calendarIncludeBase = [
    {
        model: models.collaborator,
        attributes: {
            exclude: ['id', 'created_at', 'updated_at', 'calendarCollaborators', '_search'],
        },
        through: {
            attributes: ['order'],
        },
    },
    {
        model: models.piece,
        attributes: {
            exclude: ['id', 'created_at', 'updated_at', 'calendarPieces', '_search'],
        },
        through: {
            attributes: ['order'],
        },
    },
];

apiRouter.get('/bio', async (_, res) => {
    const bio: BioInstance[] = await models.bio.findAll({
        attributes: ['paragraph', 'text'],
        order: [['paragraph', 'ASC']],
    });

    const age = moment().diff('1988-08-27', 'year');

    const [, ...rest] = bio;
    const first = { paragraph: bio[0].paragraph, text: bio[0].text.replace('##', age.toString()) };
    const bioWithAge = [first, ...rest];
    res.json(bioWithAge);
});

apiRouter.get('/acclaims', async (req, res) => {
    const params: Sequelize.FindOptions<{}> = {
        attributes: {
            exclude: ['short', 'shortAuthor', 'created_at', 'updated_at'],
        },
        order: [
            ['date', 'DESC'],
        ],
    };
    if (req.query.hasOwnProperty('count')) {
        params.limit = req.params.count;
    }
    const acclaims = await models.acclaim.findAll(params);
    res.json(acclaims);
});

// Excludes the date specified (less than)
function getEventsBefore(before: string, limit: number) {
    return models.calendar.findAll({
        attributes: {
            exclude: ['created_at', 'updated_at'],
        },
        include: calendarIncludeBase,
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
            exclude: ['created_at', 'updated_at'],
        },
        include: calendarIncludeBase,
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

// The interval is open side.
function getEventsBetween(start: string, end: string, order: 'ASC' | 'DESC') {
    return models.calendar.findAll({
        attributes: {
            exclude: ['created_at', 'updated_at'],
        },
        include: calendarIncludeBase,
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

calendarRouter.get('/search', async (req, res) => {
    const str: string = req.query.q;
    let idArray: string[];
    if (str) {
        const tokens = str.replace(', ', '|').replace(' ', '&');

        const ids: CalendarInstance[] = await db.sequelize.query(`
            SELECT c."id" FROM (
                SELECT
                    "calendar"."id",
                    "calendar"."name",
                    (tsvector_agg(coalesce("collaborators"."_search", '')) || tsvector_agg(coalesce("pieces"."_search", '')) || ("calendar"."_search")) as "tsv"
                FROM "calendar" AS "calendar"
                LEFT OUTER JOIN (
                    "calendar_collaborator" AS "collaborators->calendarCollaborator"
                    INNER JOIN "collaborator" AS "collaborators"
                        ON "collaborators"."id" = "collaborators->calendarCollaborator"."collaborator_id"
                ) ON "calendar"."id" = "collaborators->calendarCollaborator"."calendar_id"
                LEFT OUTER JOIN (
                    "calendar_piece" AS "pieces->calendarPiece"
                    INNER JOIN "piece" AS "pieces"
                        ON "pieces"."id" = "pieces->calendarPiece"."piece_id"
                ) ON "calendar"."id" = "pieces->calendarPiece"."calendar_id"
                GROUP BY "calendar"."id"
            ) c WHERE c."tsv" @@ to_tsquery('en', :query);
        `, {
                replacements: { query: tokens },
                type: Sequelize.QueryTypes.SELECT,
            });

        console.log(ids);
        idArray = ids.map(({ id }) => id);
    }

    const before = req.query.before ? moment(req.query.before) : undefined;
    const after = req.query.after ? moment(req.query.after) : undefined;
    const date = req.query.date ? moment(req.query.date) : undefined;

    let where: {
        id?: string[],
        dateTime?: any,
    } = (str) ? {
        id: idArray,
    } : {};
    if (date) {
        where = {
            dateTime: {
                [eq]: date,
            },
        };
    } else if (before && after) {
        const arr = [
            { [lt]: before },
            { [gt]: after },
        ];
        let op;
        if (before.isBefore(after)) {
            op = or;
        } else {
            op = and;
        }
        where = {
            dateTime: {
                [op]: arr,
            },
        };
    } else if (before) {
        where = {
            dateTime: {
                [lt]: before,
            },
        };
    } else if (after) {
        where = {
            dateTime: {
                [gt]: after,
            },
        };
    }

    const calendarResults: CalendarInstance[] = await db.models.calendar.findAll({
        where: {
            ...where,
        },
        attributes: {
            exclude: ['created_at', 'updated_at', '_search'],
        },
        include: calendarIncludeBase,
        order: [
            ['dateTime', 'DESC'],
            [models.collaborator, models.calendarCollaborator, 'order', 'ASC'],
            [models.piece, models.calendarPiece, 'order', 'ASC'],
        ],
    });

    res.json(calendarResults);
});

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
                getEventsAfter(date, 25),
            ]);
            response = [...betweenEvents, ...futureEvents];
            break;
        case PAST:
            [betweenEvents, pastEvents] = await Promise.all([
                getEventsBetween(date, nowMoment.format(), 'DESC'),
                getEventsBefore(date, 25),
            ]);
            response = [...betweenEvents.reverse(), ...pastEvents];
            break;
        case ALL:
            response = await model.findAll({ include: calendarIncludeBase });
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
            exclude: ['created_at', 'updated_at'],
        },
        include: [{
            model: models.musicFile,
            attributes: {
                exclude: ['created_at', 'updated_at'],
            },
        }],
        order,
    });
};

apiRouter.get('/music', async (_, res) => {
    const [solo, concerto, chamber, composition, videogame] = await Promise.all([
        getMusicInstancesOfType('solo'),
        getMusicInstancesOfType('concerto'),
        getMusicInstancesOfType('chamber'),
        getMusicInstancesOfType('composition'),
        getMusicInstancesOfType('videogame'),
    ]);

    res.json({ solo, concerto, chamber, composition, videogame });
});

apiRouter.get('/photos', async (_, res) => {
    const model = models.photo;
    const response = await model.findAll({
        attributes: {
            exclude: ['created_at', 'updated_at'],
        },
    });
    res.json(response);
});

export const ApiRouter = apiRouter;
