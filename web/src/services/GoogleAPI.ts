import axios from 'axios';

const tzAPIKey = 'AIzaSyDEs770cNo7P5z0Szrysv0T5c-l9HT3cnc';
/*
 * NOTE: All GoogleAPI functions return promises.
 */
export const geocode = (address: string) => {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
    return axios.get(url, { params: { address, key: tzAPIKey } });
};
