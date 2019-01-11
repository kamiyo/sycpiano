import { RequestHandler } from 'express';
import * as moment from 'moment-timezone';

import { BioInstance } from 'types';

import db from '../models';
const models = db.models;

const getBio: RequestHandler = async (_, res) => {
    const bio: BioInstance[] = await models.bio.findAll({
        attributes: ['paragraph', 'text'],
        order: [['paragraph', 'ASC']],
    });

    const age = moment().diff('1988-08-27', 'year');

    const [, ...rest] = bio;
    const first = { paragraph: bio[0].paragraph, text: bio[0].text.replace('##', age.toString()) };
    const bioWithAge = [first, ...rest];
    res.json(bioWithAge);
};

export default getBio;
