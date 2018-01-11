const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mustacheExpress = require('mustache-express');
const ApiRouter = require('./server/build/api-router.js').ApiRouter;

require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const port = isProduction ? process.env.PORT : 8000;

const app = express();

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

// A catch-all for everything except /admin.
// Generally we catch any route first, and then let our front-end routing do the work.
app.get(/^((?!\/admin).)*$/, (req, res) => res.render('index'));

app.listen(port, '127.0.0.1', () => console.log(`App listening on port ${port}.`));

