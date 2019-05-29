import * as Promise from 'bluebird';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as forest from 'forest-express-sequelize';
import * as path from 'path';
import * as Sequelize from 'sequelize';

dotenv.config();

import {
    createCalendarEvent,
    getCalendarSingleEvent,
    updateCalendar } from './gapi/calendar';
import db from './models';
import { calendar } from './models/calendar';

const adminRest = express.Router();

adminRest.use(express.json());
adminRest.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: (process.env.NODE_ENV === 'production' && process.env.SERVER_ENV !== 'test') ? 'https://app.forestadmin.com' : 'http://app.forestadmin.com',
    allowedHeaders: ['Authorization', 'X-Requested-With', 'Content-Type'],
    optionsSuccessStatus: 204,
};

const respondWithError = (error: any, res: express.Response) => {
    res.header('Access-Control-Allow-Origin', corsOptions.origin);
    res.header('Access-Control-Allow-Headers', ...corsOptions.allowedHeaders);
    if (error instanceof Sequelize.ValidationError) {
        res.status(400).json({
            error: (error as Sequelize.ValidationError).errors.reduce((reduce, err) => {
                return reduce + err.message + ',';
            }, ''),
        });
    } else {
        res.status(400).json({
            error: error.response.data.error.errors[0].message,
        });
    }
};

adminRest.post('/forest/actions/sync-selected', forest.ensureAuthenticated, cors(corsOptions), async (req, res) => {
    let updated = 0;
    let created = 0;
    let errored = 0;

    const ids: string[] = req.body.data.attributes.ids;
    console.log(`ids: ${ids.toString()}`);
    console.log('Getting local events from db...\n');
    const models = db.models;
    try {
        const events = await models.calendar.findAll({
            where: {
                id: ids,
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'calendarCollaborator', 'calendarPiece'],
            },
            include: [
                {
                    model: models.collaborator,
                    attributes: {
                        exclude: ['id', 'createdAt', 'updatedAt', 'calendarCollaborator'],
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
                        exclude: ['id', 'createdAt', 'updatedAt', 'calendarPiece'],
                    },
                    through: {
                        attributes: ['order'],
                    },
                    include: [{
                        model: models.CalendarPiece,
                        attributes: ['order'],
                    }],
                },
            ],
            order: [
                ['dateTime', 'DESC'],
                [models.collaborator, models.calendarCollaborator, 'order', 'ASC'],
                [models.piece, models.calendarPiece, 'order', 'ASC'],
            ],
        });
        console.log('Local events fetched from db.');
        const prunedEvents = events.map((cal) => {
            return {
                id: cal.id,
                summary: cal.name,
                location: cal.location,
                startDatetime: cal.dateTime,
                endDate: cal.endDate,
                allDay: cal.allDay,
                timeZone: cal.timezone,
                description: JSON.stringify({
                    collaborators: cal.collaborators.map((collab) => {
                        return {
                            name: collab.name,
                            instrument: collab.instrument,
                        };
                    }),
                    pieces: cal.pieces.map((piece) => {
                        return {
                            composer: piece.composer,
                            piece: piece.piece,
                        };
                    }),
                    type: cal.type,
                    website: cal.website,
                }),
            };
        });

        await Promise.each(prunedEvents, async (item) => {
            try {
                await getCalendarSingleEvent(db.sequelize, item.id);

                // if error not thrown, then event exists, update it
                await updateCalendar(db.sequelize, item);
                console.log(`updated: ${item.id}\n`);
                updated++;
            } catch (e) {
                if (e.response.status === 404) {
                    try {
                        await createCalendarEvent(db.sequelize, item);
                        console.log(`created: ${item.id}\n`);
                        created++;
                    } catch (e) {
                        console.log(`error: ${item.id}, ${e.response.status} ${e.response.statusText}\n`);
                        errored++;
                    }
                } else {
                    console.log(`error: ${item.id}, ${e.response.status} ${e.response.statusText}\n`);
                    errored++;
                    throw (e);
                }
            }
        });
        const result = `
            updating finished.
            created: ${created}
            updated: ${updated}
            errored: ${errored}
        `;
        console.log(result);
        res.status(200).json({
            success: JSON.stringify([{
                created,
                updated,
                errored,
            }]),
        });
    } catch (error) {
        respondWithError(error, res);
    }
});

adminRest.post('/forest/actions/sync', forest.ensureAuthenticated, cors(corsOptions), async (_, res) => {
    let events: calendar[];
    const limit = 10;
    let offset = 0;

    let updated = 0;
    let created = 0;
    let errored = 0;

    try {
        do {
            console.log('Getting local events from db...\n');
            const models = db.models;
            events = await models.calendar.findAll({
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'calendarCollaborator', 'calendarPiece'],
                },
                include: [
                    {
                        model: models.collaborator,
                        attributes: {
                            exclude: ['id', 'createdAt', 'updatedAt', 'calendarCollaborator'],
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
                            exclude: ['id', 'createdAt', 'updatedAt', 'calendarPiece'],
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
                order: [
                    ['dateTime', 'DESC'],
                    [models.collaborator, models.calendarCollaborator, 'order', 'ASC'],
                    [models.piece, models.calendarPiece, 'order', 'ASC'],
                ],
                limit,
                offset,
            });
            offset += limit;
            console.log('Local events fetched from db.');
            const prunedEvents = events.map((cal) => {
                return {
                    id: cal.id,
                    summary: cal.name,
                    location: cal.location,
                    startDatetime: cal.dateTime,
                    endDate: cal.endDate,
                    allDay: cal.allDay,
                    timeZone: cal.timezone,
                    description: JSON.stringify({
                        collaborators: cal.collaborators.map((collab) => {
                            return {
                                name: collab.name,
                                instrument: collab.instrument,
                            };
                        }),
                        pieces: cal.pieces.map((piece) => {
                            return {
                                composer: piece.composer,
                                piece: piece.piece,
                            };
                        }),
                        type: cal.type,
                        website: cal.website,
                    }),
                };
            });

            await Promise.each(prunedEvents, async (item) => {
                try {
                    await getCalendarSingleEvent(db.sequelize, item.id);

                    // if error not thrown, then event exists, update it
                    await updateCalendar(db.sequelize, item);
                    console.log(`updated: ${item.id}\n`);
                    updated++;
                } catch (e) {
                    if (e.response.status === 404) {
                        try {
                            await createCalendarEvent(db.sequelize, item);
                            console.log(`created: ${item.id}\n`);
                            created++;
                        } catch (e) {
                            console.log(`error: ${item.id}, ${e.response.status} ${e.response.statusText}\n`);
                            errored++;
                        }
                    } else {
                        console.log(`error: ${item.id}, ${e.response.status} ${e.response.statusText}\n`);
                        errored++;
                        throw (e);
                    }
                }
            });

        } while (events.length !== 0);
        const result = `
            updating finished.
            created: ${created}
            updated: ${updated}
            errored: ${errored}
        `;
        console.log(result);
        res.status(200).json({
            success: JSON.stringify([{
                created,
                updated,
                errored,
            }]),
        });
    } catch (error) {
        respondWithError(error, res);
    }
});

adminRest.use(forest.init({
    modelsDir: path.join(__dirname, './models'), // Your models directory.
    configDir: path.join(__dirname, './forest'),
    envSecret: process.env.FOREST_ENV_SECRET,
    authSecret: process.env.FOREST_AUTH_SECRET,
    sequelize: db.sequelize,
}));

export const AdminRest = adminRest;
