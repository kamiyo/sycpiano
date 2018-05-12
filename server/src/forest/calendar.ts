'use strict';
/* tslint:disable-next-line:no-var-requires */
const forest = require('forest-express-sequelize');

forest.collection('calendar', {
    actions: [{ name: 'sync', type: 'global' }],
});

export {};
