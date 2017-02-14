const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mustachex = require('mustachex');
const initDB = require('./server/initDB.js');
const apiRouter = require('./server/api-router.js');

const isProduction = process.env.NODE_ENV === 'production';

initDB().then(() => {
    const port = isProduction ? process.env.PORT : 8000;

    const app = express();

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

    // Non-admin routes.
    app.use(/\/api/, apiRouter);

    // A catch-all for everything except /admin.
    // Generally we catch any route first, and then let our front-end routing do the work.
    app.get(/^((?!\/admin).)*$/, (req, res) => res.render('index'));

    app.listen(port, () => console.log('App listening on port 8000.'));
});
