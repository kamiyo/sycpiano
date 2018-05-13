import * as express from 'express';
import * as path from 'path';

import * as Promise from 'bluebird';

import * as dotenv from 'dotenv';
dotenv.config();

/* tslint:disable-next-line:no-var-requires */
const forest = require('forest-express-sequelize');

import { createCalendarEvent, deleteCalendarEvent, getCalendarSingleEvent, getLatLng, getTimeZone, updateCalendar } from './gapi/calendar';
import db from './models';

import { CalendarInstance } from 'types';

const adminRest = express();

adminRest.use(express.json());
adminRest.use(express.urlencoded({ extended: true }));

adminRest.post('/forest/actions/sync-selected', forest.ensureAuthenticated, async (req, res) => {
    res.sendStatus(200);
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

// adminRest.get('/test', async (_, res) => {
//     const out: string[] = [];
//     for (let i = 0; i < 20; i++) {
//         out.push(randomBase32Str(26));
//     }
//     res.json(out);
// })

// adminRest.get('/fixIds', async (_, res) => {
//     const models = db.models;
//     const events: CalendarInstance[] = await models.calendar.findAll({
//         where: {
//             id: {
//                 [Op.regexp]: '.*_.*'
//             }
//         }
//     });

//     const output: Array<{
//         old: string;
//         new: string;
//     }> = [];

//     try {
//         await Promise.each(events, async (event) => {
//             const collabs = await event.getCollaborators();
//             const pieces = await event.getPieces();
//             console.log('here');
//             const newId = randomBase32Str(26);
//             const newCalendar: CalendarInstance = await models.calendar.create({
//                 id: newId,
//                 name: event.name,
//                 location: event.location,
//                 dateTime: event.dateTime,
//                 timezone: event.timezone,
//                 type: event.type,
//                 website: event.website,
//             } as CalendarAttributes);
//             output.push({ old: event.id, new: newId });
//             await newCalendar.setCollaborators(collabs);
//             await newCalendar.setPieces(pieces);
//             await event.destroy();
//         });
//     } catch (e) {
//         console.log(e);
//     }

//     res.json(output);
// })

adminRest.post('/forest/calendar', async (req, _, next) => {
    try {
        const {
            location,
            dateTime,
            allDay,
            endDate,
            name,
            type,
            website,
        } = req.body.data.attributes;
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
