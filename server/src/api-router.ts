import * as express from 'express';
import * as moment from 'moment-timezone';

import { uniqBy } from 'lodash';

import db from './models';
const models = db.models;
const sequelize = db.sequelize;

const apiRouter = express.Router();

import Sequelize from 'sequelize';
import { BioInstance } from 'types';
const { gt, lt } = Sequelize.Op;

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
            exclude: ['short', 'shortAuthor', 'createdAt', 'updatedAt'],
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

// The interval is open side.
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

const getSqlFromFindAll = <T>(Model: any, options: Sequelize.FindOptions<T>): Promise<string> => {
    const id = 234729387;

    return new Promise((resolve, reject) => {
        Model.addHook('beforeFindAfterOptions', id, (opts: Sequelize.FindOptions<T>) => {
            Model.removeHook('beforeFindAfterOptions', id);

            resolve(Model.sequelize.dialect.QueryGenerator.selectQuery(Model.getTableName(), opts, Model).slice(0, -1));

            /* tslint:disable-next-line:no_empty */
            return new Promise(() => {});
        });

        return Model.findAll(options).catch(reject);
    });
};

// implement date filtering on search later
calendarRouter.get('/search', async (req, res) => {
    const str: string = req.query.string;
    // const before = moment(req.query.before);
    // const after = moment(req.query.after);
    // const date = moment(req.query.date);

    const tokens = str ? str.split(' ').join(' | ') : '';

    // let where;
    // if (date.isValid()) {
    //     where = {
    //         dateTime: {
    //             [eq]: date,
    //         },
    //     };
    // } else if (before.isValid() && after.isValid()) {
    //     const arr = [
    //         { [lt]: before },
    //         { [gt]: after },
    //     ];
    //     let op;
    //     if (before.isBefore(after)) {
    //         op = or;
    //     } else {
    //         op = and;
    //     }
    //     where = {
    //         dateTime: {
    //             [op]: arr,
    //         },
    //     };
    // } else if (before.isValid()) {
    //     where = {
    //         dateTime: {
    //             [lt]: before,
    //         },
    //     };
    // } else if (after.isValid()) {
    //     where = {
    //         dateTime: {
    //             [gt]: after,
    //         },
    //     };
    // }

    const raw = await getSqlFromFindAll(db.models.calendar, {
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
        },
        // where,
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
    });

    const searchResults = await db.sequelize.query(`
        ${raw}
        WHERE (calendar._search @@ to_tsquery('english', :query)
            OR collaborators._search @@ to_tsquery('english', :query)
            OR pieces._search @@ to_tsquery('english', :query));
    `, {
            model: db.models.calendar,
            replacements: { query: tokens },
        });

    res.json(uniqBy(searchResults, (data: any) => {
        return data.id;
    }));
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
            exclude: ['createdAt', 'updatedAt'],
        },
    });
    res.json(response);
});

export const ApiRouter = apiRouter;
