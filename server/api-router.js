const express = require('express');
const models = require('./models');

const apiRouter = express.Router();

apiRouter.get('/acclaims', (req, res) => {
    const attributes = ['short', 'quote', 'author', 'shortAuthor'];

    // TODO: add order-by http://docs.sequelizejs.com/en/v3/docs/querying/
    const params = { attributes };
    if (req.query.hasOwnProperty('count')) {
        params.limit = req.params.count;
    }
    models.Acclaim.findAll(params).then(object => res.json(object));
});

apiRouter.get('/music', (req, res) => {
    res.json({items: [
        {
            title: "Spellbound Concerto",
            composer: "Miklos Rosza",
            contributing: "New West Symphony",
            url: '/music/spellbound.mp3',
            waveform: '/music/waveforms/spellbound.dat',
            id: 0,
            duration: '00:13:22'
        },
        {
            title: "Improvisation",
            composer: "Sean Chen",
            contributing: "",
            url: '/music/improv.mp3',
            waveform: '/music/waveforms/improv.dat',
            id: 1,
            duration: '00:06:18'
        }
    ]});
})

module.exports = apiRouter;
