import * as express from 'express';
import * as path from 'path';

import * as Sharp from 'sharp';

const resized = express();

resized.get('/*', (req, res) => {
    let imgPath = req.params[0];
    if (!imgPath) {
        res.status(404).end();
    }
    imgPath = path.join(__dirname, '../../web/assets/images', imgPath);

    const w = req.query.w && parseInt(req.query.w, 10);
    const h = req.query.h && parseInt(req.query.h, 10);

    if (!w && !h) {
        res.sendFile(imgPath, {}, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('sent done');
            }
            res.end();
        });
    } else {
        Sharp(imgPath)
            .resize(w, h)
            .max()
            .withoutEnlargement()
            .toBuffer((err, buff) => {
                if (err) {
                    res.status(404).end();
                }
                res.contentType('image/jpeg').write(buff, () => {
                    res.end();
                });
            });
    }
});

export const Resized = resized;
