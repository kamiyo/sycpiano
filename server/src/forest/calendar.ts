'use strict';
/* tslint:disable-next-line:no-var-requires */
const forest = require('forest-express-sequelize');

forest.collection('calendar', {
    actions: [
        { name: 'Sync', type: 'global' },
        { name: 'Sync Selected', type: 'bulk' },
    ],
});

export {};
