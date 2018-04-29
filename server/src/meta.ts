import axios from 'axios';
import { createHash } from 'crypto';
import { startCase } from 'lodash';
import * as moment from 'moment-timezone';
import * as pathToRegexp from 'path-to-regexp';

import db from './models';
import { CalendarInstance, MusicFileInstance } from './types';

const YoutubeAPIKey = 'AIzaSyAD_AhLWUhbUCnLBu4VHZR3ecakL2IbhqU';
const models = db.models;
const sequelize = db.sequelize;

const { gte, lt } = sequelize.Op;

const regex = pathToRegexp('/:first/:second?/(.*)?');
const baseString = 'Sean Chen: Pianist, Composer, Arranger | ';
const age = moment().diff('1988-08-27', 'year');
const descriptions: {
    home: string;
    about: string;
    contact: string;
    upcoming: string;
    archive: string;
    videos: string;
    music: string;
    photos: string;
    press: string;
    getMusic: (piece: string) => string;
    [index: string]: any;
} = {
        home: 'Welcome to the official website of pianist, composer, and arranger Sean Chen. Third Prize at the 2013 Van Cliburn, Christel DeHaan Classical Fellow of the 2013 American Pianists Awards, and Artist-in-Residence at University of Missouri, Kansas City.',
        about: `Hailed as a charismatic rising star with “an exceptional ability to connect with an audience combined with an easy virtuosity” (Huffington Post), ${age.toString()}-year-old American pianist Sean Chen, third prize winner at the 2013 Van Cliburn International Piano Competition and recipient of the DeHaan Classical Fellowship as the winner of the 2013 American Pianists Awards, has continued to earn accolades for “alluring, colorfully shaded renditions” (New York Times) and “genuinely sensitive” (LA Times) playing.`,
        contact: `Contact information for Sean Chen and for booking performances.`,
        upcoming: 'Upcoming recitals, concerti, and masterclasses.',
        archive: 'Past recitals, concerti, and masterclasses.',
        videos: `A playlist of Sean Chen's YouTube clips.`,
        music: `A playlist of Sean Chen's live concert recordings, and a link to his Spotify musician page.`,
        getMusic: (piece: string) => `Listen to Sean Chen's live performance of ${piece}.`,
        photos: 'Publicity photos for browsing, and a link to a Dropbox folder for high-resolution images.',
        press: `Reviews of Sean Chen's performances.`,
    };

export const getMetaFromPathAndSanitize = async (url: string) => {
    const parsed = regex.exec(url);
    if (parsed === null) {
        return {
            title: baseString + 'Home',
            description: descriptions.home,
        };
    }
    if (parsed[2] === undefined) {
        return {
            title: baseString + startCase(parsed[1]),
            description: descriptions[parsed[1]],
        };
    }
    if (parsed[3] === undefined) {
        return {
            title: baseString + startCase(parsed[1]) + ' | ' + startCase(parsed[2]),
            description: descriptions[parsed[2]],
        };
    }
    if (parsed[2] === 'music') {
        const hash = createHash('sha1').update('/' + parsed[3]).digest('base64');
        try {
            const musicFile: MusicFileInstance = (await models.musicFile.findAll({
                where: { hash },
                attributes: ['name'],
                include: [
                    {
                        model: db.models.music,
                        attributes: ['composer', 'piece'],
                    },
                ],
            }))[0];
            const {
                composer,
                piece,
            } = musicFile.music;
            return {
                title: baseString + startCase(parsed[2]) + ' | ' + composer + ' ' + piece + (musicFile.name ? ' - ' + musicFile.name : ''),
                description: descriptions.getMusic(composer + ' ' + piece + (musicFile.name ? ' - ' + musicFile.name : '')),
            };
        } catch (e) {
            return {
                title: baseString + startCase(parsed[1]) + ' | ' + startCase(parsed[2]),
                description: descriptions[parsed[2]],
                sanitize: parsed[3],
            };
        }
    }
    if (parsed[2] === 'videos') {
        const videoId = parsed[3];
        try {
            const playlistResponse = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
                params: {
                    key: YoutubeAPIKey,
                    maxResults: 1,
                    part: 'id, snippet',
                    playlistId: 'PLzauXr_FKIlhzArviStMMK08Xc4iuS0n9',
                    videoId,
                },
            });
            const video = playlistResponse.data.items[0];
            return {
                title: baseString + startCase(parsed[2]) + ' | ' + video.snippet.title,
                description: video.snippet.description,
                image: video.snippet.thumbnails.standard.url,
            };
        } catch (e) {
            return {
                title: baseString + startCase(parsed[1]) + ' | ' + startCase(parsed[2]),
                description: descriptions[parsed[2]],
                sanitize: videoId,
            };
        }
    }
    if (parsed[1] === 'schedule') {
        try {
            const date = moment(parsed[3]);
            if (!date.isValid()) {
                throw new Error('invalid date');
            }
            const event: CalendarInstance = (await models.calendar.findAll({
                where: {
                    dateTime: {
                        [gte]: date.startOf('day').format('YYYY-MM-DD'),
                        [lt]: date.add({ days: 1 }).format('YYYY-MM-DD'),
                    },
                },
                attributes: ['dateTime', 'name', 'type'],
            }))[0];
            return {
                title: baseString + moment(event.dateTime).format('MMM DD, YYYY, HH:mm zz'),
                description: startCase(parsed[2]) + ' ' + event.type + ': ' + event.name,
            };
        } catch (e) {
            return {
                title: baseString + startCase(parsed[1]),
                description: descriptions[parsed[1]],
                sanitize: parsed[3],
            };
        }
    }
};
