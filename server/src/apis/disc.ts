import { NextFunction, Request, Response } from 'express';

import db from '../models';
const models = db.models;

const discHandler = async (_: Request, res: Response, __: NextFunction) => {
    const model = models.disc;
    const response = await model.findAll({
        attributes: {
            exclude: ['created_at', 'updated_at'],
        },
        include: [{
            model: models.discLink,
            attributes: {
                exclude: ['created_at', 'updated_at'],
            },
        }],
    });
    res.json(response);
};

export default discHandler;
