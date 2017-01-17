import moment from 'moment';
import 'moment-timezone';
import {googleAPI} from '@/js/services/GoogleAPI.js'

/**
 * Set the hour and minute components of given datetime.
 * @param {moment} datetime - The datetime whose time to set.
 * @param {string} time - The time to set the datetime to.
 * @return {moment} resulting datetime
 */
function _setDatetimeTime(datetime, time) {
    // Use strict parsing for moment to check how the time is formatted.
    let parsedTime = moment(time, 'h:mA', true);
    if (!parsedTime.isValid()) {
        parsedTime = moment(time, 'H:m', true);
    }
    // TODO: handle if it doesn't match either format.
    // Don't mutate the argument.
    const newDatetime = moment(datetime);
    newDatetime.hours(parsedTime.hours());
    newDatetime.minutes(parsedTime.minutes());
    return newDatetime;
}

/**
 * Get the timezone associated with the given parameters from Google.
 * @param  {string} address
 * @param  {moment} datetime - needed for determining DST
 * @return {string} string representation of timezone (e.g. "America/Los_Angeles")
 */
function _getTimezone(address, datetime) {
    const promise = new Promise((resolve, reject) => {
        googleAPI.geocode(address)
            .then(response => {
                const firstMatch = response.data.results[0];
                const {lat, lng} = firstMatch.geometry.location;
                const timestamp = datetime.unix();
                // TODO: figure out what to do if tzData.status !== 'OK'
                googleAPI.getTimezone(lat, lng, timestamp).then(
                    response => resolve(response.data.timeZoneId)
                );
            })
            .catch(response => {
                console.log('error getting tz from google');
            });
    });
    return promise;
}

class CalendarEvent {
    constructor(valuesMap) {
        const date = valuesMap.date;
        const time = valuesMap.time;
        const startDatetime = _setDatetimeTime(date, time);
        this.collaborators = valuesMap.collaborators;
        this.eventName = valuesMap.eventName;
        this.location = valuesMap.location;
        this.program = valuesMap.program;
        this.type = valuesMap.type;
        this.finishedInitPromise = new Promise((resolve, reject) => {
            _getTimezone(this.location, startDatetime).then(timezone => {
                this.timezone = timezone;
                this.startDatetime = moment.tz(startDatetime.format('YYYY-MM-DD HH:mm'), timezone);
                // By default, just set it to 3 hours later.
                this.endDatetime = this.startDatetime.clone().add(3, 'h');
                resolve(this);
            });
        });
    }

    /**
     * Returns a JSON string representation of the event's description field.
     * @return {string}
     */
    get description() {
        // Turn `collaborators` from CSV to array
        // and trim leading and trailing whitepsaces.
        const collabsArray = this.collaborators.split(',').map(str => str.trim());
        // Turn `programs` from newline-separate value to array
        // and trim leading and trailing whitepsaces.
        const progsArray = this.program.split('\n').map(str => str.trim());
        return JSON.stringify({
            collaborators: collabsArray,
            program: progsArray,
            type: this.type,
        });
    }
}
/**
 * Static method that returns a promise that is resolved when the CalendarEvent
 * has been fully initialized.
 * @param  {object} valuesMap
 * @return {Promise}
 */
CalendarEvent.createPromise = (valuesMap) => {
    return (new CalendarEvent(valuesMap)).finishedInitPromise;
}

export {CalendarEvent};
