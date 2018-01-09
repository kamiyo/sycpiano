const Promise = require('bluebird');
const glob = require('glob');
const fs = require('fs');
const gm = require('gm').subClass({ imageMagick: true });
const path = require('path');
const smartcrop = require('smartcrop-gm');
const ocv = require('opencv');
// const cascade = require('opencv/data/haarcascade_frontalface_alt_tree.xml');

const faceDetect = (input) => {
    return new Promise((res, rej) => {
        ocv.readImage(input, (err, image) => {
            if (err) return rej(err);
            image.detectObject(path.join(__dirname, '../../../../node_modules/opencv/data/haarcascade_frontalface_alt2.xml'), {}, (err, faces) => {
                if (err) return rej(err);
                const boost = faces.map((face) => ({
                    x: face.x,
                    y: face.y,
                    width: face.width,
                    height: face.height,
                    weight: 1.0,
                }));
                res(boost);
            });
        });
    });
}

function main() {
    const out = [];
    glob(path.join(__dirname, './*.jpg'), async (err, files) => {
        await Promise.all(files.map(async (file) => {
            return new Promise(async (resolve, reject) => {
                const outObj = {};
                const pathObject = path.parse(file);
                const outPath = path.join(pathObject.dir, 'thumbnails', pathObject.base);
                outObj.file = pathObject.base;

                const { width, height } = await new Promise((res, rej) => {
                    gm(file).size((err, values) => {
                        if (err) {
                            console.log(err);
                            rej(err);
                        } else {
                            res(values);
                        }
                    });
                });

                outObj.width = width;
                outObj.height = height;

                let newHeight = null;
                let newWidth = null;
                if (height >= width) {
                    newHeight = 600;
                } else {
                    newWidth = 600;
                }
                try {
                    await new Promise((res, rej) => {
                        gm(file).resize(600, null).write(outPath, (err) => {
                            if (err) {
                                console.log('write error: ', err);
                                rej(err);
                            } else {
                                console.log('resized: ', file);
                                res();
                            }
                        });
                    });
                    let crop;
                    try {
                        const gray = path.join(pathObject.dir, 'thumbnails', `${pathObject.name}_gray${pathObject.ext}`);
                        await new Promise((res, rej) => {
                            gm(outPath).colorspace('GRAY').write(gray, (err) => {
                                if (err) {
                                    console.log('write error: ', err);
                                    rej(err);
                                } else {
                                    console.log('wrote: ', gray);
                                    res();
                                }
                            });
                        });
                        const boost = await faceDetect(gray);
                        const { topCrop } = await smartcrop.crop(gray, { width: 600, height: 400, boost });
                        crop = topCrop;
                        fs.unlink(gray, (err) => {
                            if (err) { throw(err); }
                            console.log('removed: ', gray);
                        });
                    } catch (e) {
                        throw('crop failed');
                    }

                    await new Promise((rej, res) => {
                        gm(outPath).crop(crop.width, crop.height, crop.x, crop.y).stream((err, stdout) => {
                            gm(stdout).size((err, values) => {
                                outObj.thumbnailWidth = values.width;
                                outObj.thumbnailHeight = values.height;
                            }).write(outPath, (err) => {
                                if (err) {
                                    console.log('write error: ', err);
                                    rej(err);
                                } else {
                                    console.log('cropped: ', file);
                                    res();
                                }
                            });
                        });
                    });
                } catch (e) {
                    if (e) console.log(e);
                }

                out.push(outObj);
                resolve();
            })
        }));

        console.log(out);
        fs.writeFile(path.join(__dirname, '../../data/photos.json'), JSON.stringify(out), (err) => {
            if (err) {
                throw err;
            }
            console.log('The file has been saved!');
        });
    });
}

main();