import * as express from 'express';
import * as moment from 'moment-timezone';
import Sequelize from 'sequelize';

import db from '../models';
import { calendar } from '../models/calendar';
const models = db.models;

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

interface CalendarQuery {
    q?: string;
    before?: string;
    after?: string;
    date?: string;
    limit?: string;
}

calendarRouter.get('/search', async (req: express.Request<any, any, any, CalendarQuery>, res) => {
    const str: string = req.query.q;
    let idArray: string[];
    if (str) {
        const tokens = str.replace(', ', '|').replace(' ', '&');

        const ids: calendar[] = await db.sequelize.query(`
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
        id?: string[];
        dateTime?: any;
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

    const calendarResults: calendar[] = await db.models.calendar.findAll({
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

calendarRouter.get('/', async (req: express.Request<any, any, any, CalendarQuery>, res) => {
    const model = models.calendar;

    const limit = req.query.limit && parseInt(req.query.limit);
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

export default calendarRouter;
