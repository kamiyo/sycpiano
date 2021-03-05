import { NextFunction, Request, Response } from 'express';

import db from '../models';
const models = db.models;

const photosHandler = async (_: Request, res: Response, __: NextFunction): Promise<void> => {
    const model = models.photo;
    const response = await model.findAll({
        attributes: {
            exclude: ['created_at', 'updated_at'],
        },
    });
    res.json(response);
};

export default photosHandler;
