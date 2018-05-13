import * as express from 'express';
import * as path from 'path';

import * as Promise from 'bluebird';

import * as dotenv from 'dotenv';
dotenv.config();

/* tslint:disable-next-line:no-var-requires */
const forest = require('forest-express-sequelize');

import { createCalendarEvent, deleteCalendarEvent, getCalendarSingleEvent, getLatLng, getTimeZone, updateCalendar } from './gapi/calendar';
import { getHash } from './hash';
import db from './models';

import { CalendarAttributes, CalendarInstance, MusicAttributes, MusicFileAttributes, MusicFileInstance, MusicFileModel, MusicInstance } from 'types';

const adminRest = express();

adminRest.use(express.json());
adminRest.use(express.urlencoded({ extended: true }));

adminRest.post('/forest/actions/sync-selected', forest.ensureAuthenticated, async (req, res) => {
    res.status(200).json({ success: 'successfully queued' });
    res.end();
    let updated = 0;
    let created = 0;
    let errored = 0;

    const ids: string[] = req.body.data.attributes.ids;
    console.log(`ids: ${ids.toString()}`);
    console.log('Getting local events from db...\n');
    const models = db.models;
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

});

adminRest.post('/forest/actions/sync', forest.ensureAuthenticated, async (_, res) => {
    res.sendStatus(200);

    let events: CalendarInstance[];
    const limit = 10;
    let offset = 0;

    let updated = 0;
    let created = 0;
    let errored = 0;

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
});

const updateMusicFileHash = async (req: express.Request, _: express.Response, next: () => any) => {
    try {
        const {
            name,
            musicId,
        }: MusicFileAttributes = req.body.data.attributes;

        const music: MusicInstance = await db.models.music.findOne({
            where: {
                id: musicId,
            },
        });
        const hash = getHash(music.composer, music.piece, name);
        req.body.data.attributes.hash = hash;

        next();
    } catch (e) {
        console.log(e);
    }
};

adminRest.post('/forest/musicfile', forest.ensureAuthenticated, updateMusicFileHash);

adminRest.put('/forest/musicfile', forest.ensureAuthenticated, updateMusicFileHash);

adminRest.put('/forest/music', forest.ensureAuthenticated, async (req, _, next) => {
    try {
        const {
            id,
            composer,
            piece,
        }: MusicAttributes = req.body.data.attributes;

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
    } catch (e) {
        console.log(e);
    }
});

adminRest.post('/forest/calendar', forest.ensureAuthenticated, async (req, _, next) => {
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
    } catch (e) {
        console.log(e.response.data.error);
    }
});

adminRest.delete('/forest/calendar/:id', forest.ensureAuthenticated, async (req, _, next) => {
    const id = req.params.id;
    try {
        await deleteCalendarEvent(id);
    } catch (e) {
        console.log(e);
    }
    next();
});

adminRest.use(forest.init({
    modelsDir: path.join(__dirname, './models'), // Your models directory.
    configDir: path.join(__dirname, './forest'),
    envSecret: process.env.FOREST_ENV_SECRET,
    authSecret: process.env.FOREST_AUTH_SECRET,
    sequelize: db.sequelize,
}));

export const AdminRest = adminRest;
