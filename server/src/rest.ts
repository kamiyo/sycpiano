import * as express from 'express';
import * as moment from 'moment';
import * as path from 'path';

import * as Promise from 'bluebird';

import * as dotenv from 'dotenv';
dotenv.config();

/* tslint:disable-next-line:no-var-requires */
const forest = require('forest-express-sequelize');

import { createCalendarEvent, deleteCalendarEvent, getCalendarSingleEvent, getLatLng, getTimeZone, GoogleCalendarParams, updateCalendar } from './gapi/calendar';
import db from './models';

import { CalendarInstance } from 'types';

const adminRest = express();

adminRest.use(express.json());
adminRest.use(express.urlencoded({ extended: true }));

adminRest.get('/sync', async (_, res) => {
    const models = db.models;
    const events: CalendarInstance[] = await models.calendar.findAll({
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
    const prunedEvents = events.map((cal) => {
        return {
            id: cal.id,
            summary: cal.name,
            location: cal.location,
            startDatetime: moment(cal.dateTime),
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
    const responses: {
        updated: Array<{
            id: string,
        }>,
        created: Array<{
            id: string,
        }>,
        error: Array<{
            item: GoogleCalendarParams,
            status: number,
        }>,
    } = {
            updated: [],
            created: [],
            error: [],
        };

    await Promise.each(prunedEvents, async (item) => {
        try {
            await getCalendarSingleEvent(item.id);

            // if error not thrown, then event exists, update it
            await updateCalendar(item);
            responses.updated.push({ id: item.id });
        } catch (e) {
            if (e.response.status === 404) {
                // not found, means we need to create event
                try {
                    await createCalendarEvent(item);
                    responses.created.push({ id: item.id });
                } catch (e) {
                    responses.error.push({ item, status: e.response.status });
                }
            } else {
                responses.error.push({ item, status: e.response.status });
            }
        }
    });

    res.json(responses);
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
            name,
            type,
            website,
        } = req.body.data.attributes;
        let timezone = null;
        if (location) {
            const { latlng } = await getLatLng(location);
            timezone = await getTimeZone(latlng.lat, latlng.lng, moment(dateTime));
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
            timeZone: timezone,
        });
        const id = createResponse.data.id;

        req.body.data.attributes = {
            ...req.body.data.attributes,
            id,
            location,
            timezone,
        };
    } catch (e) {
        console.log(e.response.data.error);
    }
    next();
});

adminRest.delete('/forest/calendar/:id', async (req, _, next) => {
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
    envSecret: process.env.FOREST_ENV_SECRET,
    authSecret: process.env.FOREST_AUTH_SECRET,
    sequelize: db.sequelize,
}));

export const AdminRest = adminRest;
