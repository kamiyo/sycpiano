const moment = require('moment');
const sequelize = require('../sequelize.js');
const initDB = require('../server/initDB.js');

const axios = require('axios');

const importModels = require('../server/models').importModels;

const calAPIKey = 'AIzaSyAp8zdSYdVLgHKV-3VXvS7Zp9G9wVuO4sM';
const calendarId = 'c7dolt217rdb9atggl25h4fspg@group.calendar.google.com';
const uriEncCalId = encodeURIComponent(calendarId);

function getCalendarEvents(timeMin = moment(0)) {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${uriEncCalId}/events`;
    console.log(url);
    return axios.get(url, {
        params: {
            orderBy: 'startTime',
            singleEvents: true,
            timeMin: timeMin.format(),
            key: calAPIKey,
        },
    });
}

initDB().then(() => {
    const model = importModels(sequelize)['Calendar'];
    model.destroy({ where: {}, truncate: true }).then(() => {
        getCalendarEvents().then((response) => {
            model.create(response.data).then(() => {
                console.log('successfully created');
            });
        }).catch((e) => {
            console.log(e);
        });
    }).catch((e) => {
        console.log(e);
    })
})