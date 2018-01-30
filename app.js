const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const https = require('https');
const morgan = require('morgan');
const path = require('path');
const mustacheExpress = require('mustache-express');
const ApiRouter = require('./server/build/api-router.js').ApiRouter;

require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const port = isProduction ? process.env.PORT : 8000;
const listenAddr = isProduction ? '0.0.0.0' : '127.0.0.1';

const app = express();

// HTTPS setup
const httpsOptions = {
    cert: fs.readFileSync('./sslcert/fullchain.pem'),
    key: fs.readFileSync('./sslcert/privkey.pem'),
};

// helmet will add HSTS to force HTTPS connections, remove x-powered-by non-standard header,
// sets x-frame-options header to disallow our content to be rendered in iframes.
app.use(helmet());

// .well-known/acme-challenge is the path Certbot uses to verify this webserver.
// Since we're placing this directory at the project root,
// we'll need to add the project root as a static path.
app.use(express.static(__dirname));

app.use(express.static(path.join(__dirname, '/web/assets')));
app.use(express.static(path.join(__dirname, '/web/build')));

app.use(morgan('common'));
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/web/partials'));

// Matches the /admin route.
app.get(/\/admin/, (req, res) => res.render('calendar-admin'));

// Non-admin routes.
app.use(/\/api/, ApiRouter);

// Health-check endpoint.
app.get('/health-check', (req, res) => res.sendStatus(200));

// A catch-all for everything except /admin.
// Generally we catch any route first, and then let our front-end routing do the work.
app.get(/^((?!\/admin).)*$/, (req, res) => res.render('index'));

app.listen(port, listenAddr, () => console.log(`App listening on port ${port}.`));

// Have HTTPS listen on 443
https.createServer(httpsOptions, app).listen(443);
