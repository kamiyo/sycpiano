import { RequestHandler } from 'express';
import Sequelize from 'sequelize';

import db from '../models';
const models = db.models;

const getAcclaims: RequestHandler = async (req, res) => {
    const params: Sequelize.FindOptions = {
        attributes: {
            exclude: ['short', 'shortAuthor', 'created_at', 'updated_at'],
        },
        order: [
            ['date', 'DESC'],
        ],
    };
    if (Object.prototype.hasOwnProperty.call(req.query, 'count')) {
        params.limit = req.params.count;
    }
    const acclaims = await models.acclaim.findAll(params);
    res.json(acclaims);
};

export default getAcclaims;
