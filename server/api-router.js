const express = require('express');
const models = require('./models');

const apiRouter = express.Router();

apiRouter.get('/acclaims', (req, res) => {
    const count = req.params.count;
    models.Acclaim.findAll({
        attributes: ['short'],
        limit: count,
        // TODO: add order-by http://docs.sequelizejs.com/en/v3/docs/querying/
    }).then(object => res.json(object));
});

module.exports = apiRouter;
