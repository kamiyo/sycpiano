import * as express from 'express';
import * as path from 'path';

import * as Promise from 'bluebird';

const resized = express();

resized.get('/*', (req, res) => {
    let imgPath = req.params[0];
    if (!imgPath) {
        res.end();
    }
    res.write(imgPath);
    imgPath = path.join(__dirname, '../../web/assets/images', imgPath);

    res.end();
});

export const Resized = resized;
