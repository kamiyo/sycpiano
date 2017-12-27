import * as express from 'express';
import models from './models/index';
import * as moment from 'moment-timezone';

const apiRouter = express.Router();

import Sequelize from 'sequelize';
import { CalendarModel } from 'types';
const { gt, lt } = Sequelize.Op;

apiRouter.get('/acclaims', (req, res) => {
    const attributes = ['short', 'quote', 'author', 'shortAuthor'];

    // TODO: add order-by http://docs.sequelizejs.com/en/v3/docs/querying/
    const params: Sequelize.FindOptions<{}> = { attributes };
    if (req.query.hasOwnProperty('count')) {
        params.limit = req.params.count;
    }
    models.acclaim.findAll(params).then(object => res.json(object));
});

// Excludes the date specified (less than)
function getEventsBefore(before: string, limit: number, model: CalendarModel) {
    return model.findAll({
        where: {
            dateTime: {
                [lt]: before,
            },
        },
        limit,
        order: [['dateTime', 'DESC']],
    });
}

// Includes the date specified (greater than)
function getEventsAfter(after: string, limit: number, model: CalendarModel) {
    return model.findAll({
        where: {
            dateTime: {
                [gt]: after,
            },
        },
        limit,
        order: [['dateTime', 'ASC']],
    });
}

// The interval is open on the less-than side.
function getEventsBetween(start: string, end: string, order: 'ASC' | 'DESC', model: CalendarModel) {
    return model.findAll({
        where: {
            dateTime: {
                [gt]: start,
                [lt]: end,
            },
        },
        order: [['dateTime', order]],
    });
}

const AFTER = 2;
const FUTURE = 1;
const ALL = 0;
const PAST = -1;
const BEFORE = -2;

apiRouter.get('/calendar', async (req, res) => {
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

    let response, betweenEvents, futureEvents, pastEvents;
    switch (type) {
        case FUTURE:
            betweenEvents = await getEventsBetween(nowMoment.format(), date, 'ASC', model);
            futureEvents = await getEventsAfter(date, 5, model);
            response = [...betweenEvents, ...futureEvents];
            break;
        case PAST:
            betweenEvents = await getEventsBetween(date, nowMoment.format(), 'DESC', model);
            pastEvents = await getEventsBefore(date, 5, model);
            response = [...betweenEvents.reverse(), ...pastEvents];
            break;
        case ALL:
            response = await model.findAll();
            break;
        case AFTER:
            response = await getEventsAfter(after, limit, model);
            break;
        case BEFORE:
            response = await getEventsBefore(before, limit, model);
            break;
        default:
            break;
    }

    console.log(response.length);
    res.json(response);
});

apiRouter.get('/music', (_, res) => {
    res.json({
        items: [
            {
                title: "Spellbound Concerto",
                composer: "Miklos Rosza",
                contributing: "New West Symphony",
                url: '/music/spellbound.mp3',
                waveform: '/music/waveforms/spellbound.dat',
                id: 'spellbound',
                duration: '00:13:22'
            },
            {
                title: "Improvisation",
                composer: "Sean Chen",
                contributing: "",
                url: '/music/improv.mp3',
                waveform: '/music/waveforms/improv.dat',
                id: 'improv',
                duration: '00:06:18'
            }
        ]
    });
});

apiRouter.get('/images', (_, res) => {
    res.json({
        items: [
            'bg_1.jpg',
            'cliburn1.jpg',
            'cliburn4.jpg',
            'cliburn7.jpg',
            'syc_chair.jpg',
            'syc_headshot1.jpg',
            'syc_walking.jpg',
            'syc_withpiano.jpg',
            'syc_withpiano_bw.jpg',
        ],
    });
});

export const ApiRouter = apiRouter;
