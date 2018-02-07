import * as express from 'express';
import * as path from 'path';

import * as dotenv from 'dotenv';
dotenv.config();

/* tslint:disable-next-line:no-var-requires */
const forest = require('forest-express-sequelize');

import db from './models';

const adminRouter = express();

adminRouter.use(forest.init({
    modelsDir: path.join(__dirname, './models'), // Your models directory.
    envSecret: process.env.FOREST_ENV_SECRET,
    authSecret: process.env.FOREST_AUTH_SECRET,
    sequelize: db.sequelize,
}));

export const AdminRouter = adminRouter;
