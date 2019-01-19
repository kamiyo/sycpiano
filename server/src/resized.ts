/* Resized api
 * When a request is made to /resized, we will check
 * 1. If neither width nor height queries exist
 *      send the image unaltered.
 *      finished.
 * 2. Generate new pathname with .resized-cache inserted.
 * 3. Use mkdirp to create the necessary directories (or do nothing if exists).
 * 4. If the image with the right size exists in .resized-cache
 *      send that.
 *      finished.
 * 5. Use Sharp to generate resized images, and store in .resized-cache
 * 6. Send resized image.
 */

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

    // not sure if we can use a static sendFile and move this outside the resized block
    const sendFileAsync = Promise.promisify(res.sendFile);

    if (!w && !h) {
        try {
            // Return file unaltered
            await sendFileAsync.call(res, imgPath, {});
            res.end();
        } catch (e) {
            console.error(e);
            res.status(400).json({ error: 'Could not send image.'});
        }

    } else {
        const parsedPath = path.parse(req.params[0]);
        const width = w ? `w${w}` : '';
        const height = h ? `h${h}` : '';
        // filename is generated based on dimensions.
        const filename = `${parsedPath.name}.${width}${height}${parsedPath.ext}`;
        // newDir is where the cached image directory.
        const newDir = path.join(__dirname, '../../.resized-cache/', parsedPath.dir);
        try {
            await new Promise((resolve, reject) => {
                // make dir, quietly exit if already exists
                mkdirp(newDir, (err: NodeJS.ErrnoException) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            // path to the image in the cache.
            const newPath = path.join(newDir, filename);

            try {
                // Check if cached image exists.
                await statAsync(newPath);

                try {
                    // send the cached image.
                    await sendFileAsync.call(res, newPath, {});
                    res.end();
                } catch (e) {
                    console.error(e);
                    res.status(400).json({ error: 'Could not send cached image.'});
                }
            } catch (_) {
                // Cached image does not exist
                try {
                    // Try if we can open the specified image, and resize and save it.
                    await Sharp(imgPath)
                        .resize(w, h, { fit: 'inside', withoutEnlargement: true })
                        .toFile(newPath);

                } catch (e) {
                    // Here means that the specified image doesn't exist.
                    // But maybe it exists with a different extention (.jpg).
                    // Mostly happens with .webp requests.
                    // So let's resize and convert to webp and save it.
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
                        res.status(400).json({ error: 'Could not find base image to resize.'});
                    }
                }

                // Finally send it.
                await sendFileAsync.call(res, newPath, {});
                res.end();
            }
        } catch (e) {
            console.error(e);
            res.status(500).end();
        }
    }
});

export const Resized = resized;
