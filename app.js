const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
const mustachex = require('mustachex');

const isProduction = process.env.NODE_ENV === 'production';
const port = isProduction ? process.env.PORT : 8000;

app.use(express.static(__dirname + '/web/assets'));
app.use(morgan('common'));
app.engine('html', mustachex.express);
app.set('view engine', 'html');
app.set('views', __dirname + '/web/partials');

// We only want to run the workflow proxying in development.
if (!isProduction) {
    const bundler = require('./server/bundle-code.js');
    bundler.bundleCode();

    // We want to proxy any requests sent to localhost:8000/build
    // to the webpack-dev-server.
    app.use(bundler.router);
}

// Matches the /admin route.
app.get(/\/admin/, (req, res) => res.render('calendar-admin'));

// Actual app code. A catch-all for everything except /admin.
// We catch any route first, and then let our front-end routing do the work.
app.get(/^((?!\/admin).)*$/, (req, res) => res.render('index'));

app.listen(port, () => console.log('App listening on port 8000.'));
