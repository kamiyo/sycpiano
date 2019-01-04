import * as Promise from 'bluebird';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';

/* tslint:disable-next-line */
const mkdirp = require('mkdirp');
import * as Sharp from 'sharp';

const statAsync = Promise.promisify(fs.stat);

const resized = express();

resized.get('/*', async (req, res) => {
    let imgPath = req.params[0];
    if (!imgPath) {
        res.status(404).end();
    }
    imgPath = path.join(__dirname, '../../web/assets/images', imgPath);

    const w = req.query.width && parseInt(req.query.width, 10);
    const h = req.query.height && parseInt(req.query.height, 10);

    const sendFileAsync = Promise.promisify(res.sendFile);

    if (!w && !h) {
        try {
            await sendFileAsync.call(res, imgPath, {});
            res.end();
        } catch (e) {
            console.error(e);
        }

    } else {
        const parsedPath = path.parse(req.params[0]);
        const width = w ? `w${w}` : '';
        const height = h ? `h${h}` : '';
        const filename = `${parsedPath.name}.${width}${height}${parsedPath.ext}`;
        const newDir = path.join(__dirname, '../../.resized-cache/', parsedPath.dir);
        try {
            await new Promise((resolve, reject) => {
                mkdirp(newDir, (err: NodeJS.ErrnoException) => {
                    if (err) {
                        reject();
                    } else {
                        resolve();
                    }
                });
            });
            const newPath = path.join(newDir, filename);

            try {
                await statAsync(newPath);

                try {
                    await sendFileAsync.call(res, newPath, {});
                    res.end();
                } catch (e) {
                    console.error(e);
                }
            } catch (_) {
                try {
                    await Sharp(imgPath)
                        .resize(w, h, { fit: 'inside', withoutEnlargement: true })
                        .toFile(newPath);

                } catch (e) {
                    const parsedImg = path.parse(imgPath);
                    const jpegPath = `${parsedImg.dir}/${parsedImg.name}.jpg`;
                    try {
                        await statAsync(jpegPath);
                        await Sharp(jpegPath)
                            .resize(w, h, { fit: 'inside', withoutEnlargement: true })
                            .webp()
                            .toFile(newPath);
                    } catch (e) {
                        console.error(e);
                    }
                }

                await sendFileAsync.call(res, newPath, {});
                res.end();
            }
        } catch (e) {
            console.error(e);
        }
    }
});

export const Resized = resized;
