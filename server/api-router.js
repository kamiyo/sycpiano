const express = require('express');
const models = require('./models');
const moment = require('moment');

const apiRouter = express.Router();

const { gte, lt } = require('sequelize').Op;

apiRouter.get('/acclaims', (req, res) => {
    const attributes = ['short', 'quote', 'author', 'shortAuthor'];

    // TODO: add order-by http://docs.sequelizejs.com/en/v3/docs/querying/
    const params = { attributes };
    if (req.query.hasOwnProperty('count')) {
        params.limit = req.params.count;
    }
    models.Acclaim.findAll(params).then(object => res.json(object));
});

apiRouter.get('/calendar', async (req, res) => {
    const after = req.query.after ? req.query.after : moment(0).format("YYYY-MM-DD");
    console.log(after);
    const model = models.Calendar;
    const eventsAfter = await model.findAll({
        where: {
            dateTime: {
                [gte]: after,
            },
        },
        limit: 10,
        order: [['dateTime', 'ASC']],
    });
    const eventsBefore = await model.findAll({
        where: {
            dateTime: {
                [lt]: after,
            },
        },
        limit: 10,
        order: [['dateTime', 'DESC']],
    });
    res.json([...(eventsBefore.reverse()), ...eventsAfter]);
});

apiRouter.get('/music', (req, res) => {
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
})

module.exports = apiRouter;
