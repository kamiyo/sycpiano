import * as Promise from 'bluebird';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as forest from 'forest-express-sequelize';
import * as path from 'path';
import * as Sequelize from 'sequelize';

dotenv.config();

import { createCalendarEvent, deleteCalendarEvent, getCalendarSingleEvent, getLatLng, getTimeZone, updateCalendar } from './gapi/calendar';
import { getHash } from './hash';
import db from './models';

import { CalendarAttributes, CalendarInstance, MusicAttributes, MusicFileAttributes, MusicFileInstance, MusicFileModel, MusicInstance } from 'types';

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
        const events: CalendarInstance[] = await models.calendar.findAll({
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
                await getCalendarSingleEvent(item.id);

                // if error not thrown, then event exists, update it
                await updateCalendar(item);
                console.log(`updated: ${item.id}\n`);
                updated++;
            } catch (e) {
                if (e.response.status === 404) {
                    try {
                        await createCalendarEvent(item);
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
    let events: CalendarInstance[];
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
                    await getCalendarSingleEvent(item.id);

                    // if error not thrown, then event exists, update it
                    await updateCalendar(item);
                    console.log(`updated: ${item.id}\n`);
                    updated++;
                } catch (e) {
                    if (e.response.status === 404) {
                        try {
                            await createCalendarEvent(item);
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

const updateMusicFileHash = async (req: express.Request, res: express.Response, next: () => any) => {
    try {
        let {
            name,
            musicId,
        }: MusicFileAttributes = req.body.data.attributes;

        if (!musicId) {
            musicId = req.body.data.relationships.music.data.id;
        }

        if (!name || !musicId) {
            const musicFile: MusicFileInstance = await db.models.musicFile.findOne({
                where: {
                    id: req.params.id,
                },
            });
            name = (name) ? name : musicFile.name;
            musicId = (musicId) ? musicId : musicFile.musicId;
        }

        const music: MusicInstance = await db.models.music.findOne({
            where: {
                id: musicId,
            },
        });
        const hash = getHash(music.composer, music.piece, name);
        req.body.data.attributes.hash = hash;

        next();
    } catch (error) {
        respondWithError(error, res);
    }
};

adminRest.post('/forest/musicfile', forest.ensureAuthenticated, updateMusicFileHash);

adminRest.put('/forest/musicfile/:id', forest.ensureAuthenticated, updateMusicFileHash);

adminRest.put('/forest/music/:id', forest.ensureAuthenticated, async (req, res, next) => {
    try {
        const {
            id,
        }: MusicAttributes = req.params;

        let {
            composer,
            piece,
        }: MusicAttributes = req.body.data.attributes;

        if (!composer || !piece) {
            const music: MusicInstance = await db.models.music.findOne({
                where: {
                    id,
                },
            });
            composer = (composer) ? composer : music.composer;
            piece = (piece) ? piece : music.piece;
        }

        const musicFiles: MusicFileInstance[] = await (db.models.musicFile as MusicFileModel).findAll({
            where: {
                musicId: id,
            },
        });
        await Promise.each(musicFiles, async (musicFile) => {
            const {
                name,
            } = musicFile;
            const hash = getHash(composer, piece, name);
            await musicFile.update({ hash });
        });

        next();
    } catch (error) {
        console.log(error);
        respondWithError(error, res);
    }
});

adminRest.post('/forest/calendar', forest.ensureAuthenticated, async (req, res, next) => {
    try {
        const {
            location,
            dateTime,
            allDay,
            endDate,
            name,
            type,
            website,
        }: CalendarAttributes = req.body.data.attributes;
        let timezone = null;
        if (location) {
            const { latlng } = await getLatLng(location);
            timezone = await getTimeZone(latlng.lat, latlng.lng, dateTime);
        }

        const description = JSON.stringify({
            collaborators: [],
            pieces: [],
            type,
            website: encodeURI(website) || '',
        });

        const createResponse = await createCalendarEvent({
            summary: name,
            description,
            location,
            startDatetime: dateTime,
            endDate,
            allDay,
            timeZone: timezone,
        });
        const id = createResponse.data.id;

        req.body.data.attributes = {
            ...req.body.data.attributes,
            id,
            location,
            timezone,
        };
        next();
    } catch (error) {
        console.log(error);
        respondWithError(error, res);
    }
});

adminRest.delete('/forest/calendar/:id', forest.ensureAuthenticated, async (req, res, next) => {
    const id = req.params.id;
    try {
        await deleteCalendarEvent(id);
        next();
    } catch (error) {
        console.log(error);
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
