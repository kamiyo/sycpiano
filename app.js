const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const https = require('https');
const morgan = require('morgan');
const path = require('path');
const mustacheExpress = require('mustache-express');
const ApiRouter = require('./server/build/api-router.js').ApiRouter;
const AdminRest = require('./server/build/rest.js').AdminRest;
const Resized = require('./server/build/resized.js').Resized;
const toStartCase = require('lodash').startCase;
const db = require('./server/build/models/index.js').default;
const pathToRegexp = require('path-to-regexp');
const startCase = require('lodash').startCase;
const moment = require('moment-timezone');
const createHash = require('crypto').createHash;

const isProduction = process.env.NODE_ENV === 'production';

const port = isProduction ? process.env.PORT : 8000;
const listenAddr = isProduction ? '0.0.0.0' : '127.0.0.1';

const app = express();

// helmet will add HSTS to force HTTPS connections, remove x-powered-by non-standard header,
// sets x-frame-options header to disallow our content to be rendered in iframes.
app.use(helmet());

app.use('/static', express.static(path.join(__dirname, '/web/assets')));
app.use('/static', express.static(path.join(__dirname, '/web/build')));

app.use(morgan('common'));
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/web/build'));

// Matches the /admin route.
app.get(/\/admin/, (req, res) => res.redirect('https://app.forestadmin.com'));

// Extends Forest api
app.use(/\/rest/, AdminRest);

// Non-admin routes.
app.use(/\/api/, ApiRouter);

// Resize images.
app.use(/\/resized/, Resized);

// Health-check endpoint.
app.get('/health-check', (req, res) => res.sendStatus(200));

// Redirect old URLs that are indexed on google to base route.
const oldRoutesToRedirectsMap = {
    '/home': '/',
    '/music': '/media/music',
};

Object.keys(oldRoutesToRedirectsMap).forEach(key => (
    app.get(key, (req, res) => res.redirect(oldRoutesToRedirectsMap[key]))
));

const regex = pathToRegexp('/:first/:second?/(.*)?');
const baseString = 'Sean Chen: Pianist, Composer, Arranger | ';
const age = moment().diff('1988-08-27', 'year');
const descriptions = {
    home: 'Welcome to the official website of pianist, composer, and arranger Sean Chen. Third Prize at the 2013 Van Cliburn, Christel DeHaan Classical Fellow of the 2013 American Pianists Awards, and Artist-in-Residence at University of Missouri, Kansas City.',
    about: `Hailed as a charismatic rising star with “an exceptional ability to connect with an audience combined with an easy virtuosity” (Huffington Post), ${age.toString()}-year-old American pianist Sean Chen, third prize winner at the 2013 Van Cliburn International Piano Competition and recipient of the DeHaan Classical Fellowship as the winner of the 2013 American Pianists Awards, has continued to earn accolades for “alluring, colorfully shaded renditions” (New York Times) and “genuinely sensitive” (LA Times) playing.`,
    upcoming: 'Upcoming recitals, concerti, and masterclasses',
    archive: 'Past recitals, concerti, and masterclasses',
    videos: 'A playlist of Sean Chen\'s YouTube clips',
    music: 'A playlist of Sean Chen\'s live concert recordings, and a link to his Spotify musician page',
    music: (piece) => `Listen to Sean Chen's live performance of ${piece}.`,
    photos: 'Publicity photos for browsing, and a link to a Dropbox folder for high-resolution images',
};

const getMetaFromPath = async (url) => {
    const parsed = regex.exec(url);
    console.log(parsed);
    if (parsed === null) return {
        title: baseString + 'Home',
        description: descriptions.home,
    };
    if (parsed[2] === undefined) return {
        title: baseString + startCase(parsed[1]),
        description: descriptions[parsed[1]],
    };
    if (parsed[3] === undefined) return {
        title: baseString + startCase(parsed[1]) + ' | ' + startCase(parsed[2]),
        description: descriptions[parsed[2]],
    };
    if (parsed[2] === 'music') {
        const hash = createHash('sha1').update('/' + parsed[3]).digest('base64');
        console.log(hash);
        const musicFile = (await db.models.musicFile.findAll({
            where: { hash },
            include: [
                { model: db.models.music }
            ]
        }))[0];
        const {
            composer,
            piece,
        } = musicFile.music;
        return {
            title: baseString + startCase(parsed[2]) + ' | ' + composer + ' ' + piece + (musicFile.name ? ' - ' + musicFile.name : ''),
            description: descriptions.music(composer + ' ' + piece + (musicFile.name ? ' - ' + musicFile.name : '')),
        };
    }
}

// We catch any route first, and then let our front-end routing do the work.
app.get(/\//, async (req, res) => {
    const twitter = await getMetaFromPath(req.url);
    res.render('index', {
        twitter,
    });
});

app.listen(port, listenAddr, () => console.log(`App listening on port ${port}.`));
