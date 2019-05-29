'use strict';

import { calendar } from 'models/calendar';
import * as moment from 'moment';

/* tslint:disable-next-line:no-var-requires */
const forest = require('forest-express-sequelize');

forest.collection('calendar', {
    actions: [
        { name: 'Sync', type: 'global' },
        { name: 'Sync Selected', type: 'bulk' },
    ],
    fields: [{
        field: 'DateTime Input',
        type: 'String',
        get: (cal: calendar) => {
            return moment(cal.dateTime).tz(cal.timezone).format('YYYY-MM-DD HH:mm');
        },
        set: (cal: calendar, input: string) => {
            cal.dateTime = moment(input).toDate();
            return cal;
        },
    }],
});

export {};
