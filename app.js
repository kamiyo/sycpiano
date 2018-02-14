const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const https = require('https');
const morgan = require('morgan');
const path = require('path');
const mustacheExpress = require('mustache-express');
const ApiRouter = require('./server/build/api-router.js').ApiRouter;
const AdminRest = require('./server/build/rest.js').AdminRest;

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
app.set('views', path.join(__dirname, '/web/partials'));

// Matches the /admin route.
app.get(/\/admin/, (req, res) => res.redirect('https://app.forestadmin.com'));

app.use(/\/rest/, AdminRest);

// Non-admin routes.
app.use(/\/api/, ApiRouter);

// Health-check endpoint.
app.get('/health-check', (req, res) => res.sendStatus(200));

// Redirect old URLs that are indexed on google to base route.
app.get('/home', (req, res) => res.redirect('/'));
app.get('/music', (req, res) => res.redirect('/media/music'));

// We catch any route first, and then let our front-end routing do the work.
app.get(/\//, (req, res) => res.render('index'));

app.listen(port, listenAddr, () => console.log(`App listening on port ${port}.`));
