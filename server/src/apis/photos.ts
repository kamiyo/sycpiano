import { RequestHandler } from 'express';

import db from '../models';
const models = db.models;

const photosHandler: RequestHandler = async (_, res) => {
    const model = models.photo;
    const response = await model.findAll({
        attributes: {
            exclude: ['created_at', 'updated_at'],
        },
    });
    res.json(response);
};

export default photosHandler;
