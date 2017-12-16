const moment = require('moment');
const sequelize = require('../sequelize.js');
const initDB = require('../server/initDB.js');

const axios = require('axios');

const importModels = require('./models').importModels;

const calAPIKey = 'AIzaSyC8YGSlCPlqT-MAHN_LvM2T3K-ltaiqQMI';
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

const extractEventDescription = (event) => {
    try {
        return JSON.parse(event.description);
    } catch (e) {
        return {};
    }
};

async function main () {
    try {
        await initDB();
        const model = importModels(sequelize)['Calendar'];
        await model.destroy({ where: {}, truncate: true });
        const response = await getCalendarEvents();
        const items = response.data.items.map(event => {
            const dateTime = event.start.dateTime ? event.start.dateTime : event.start.date;
            const timezone = event.start.dateTime ? event.start.timeZone : '';
            const {
                collaborators,
                type,
                program,
            } = extractEventDescription(event);

            const UUID = event.id;
            const name = event.summary;
            const location = event.location;
            return {
                UUID,
                name,
                dateTime,
                timezone,
                location,
                collaborators,
                type,
                program,
            };
        });
        await model.bulkCreate(items);
        console.log('successfully created');
        process.exit();
    } catch (e) {
        console.log(e);
        process.exit();
    }
};

main();