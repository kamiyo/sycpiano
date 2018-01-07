const Promise = require('bluebird');
const glob = require('glob');
const fs = require('fs');
const gm = require('gm');
const path = require('path');

function main() {
    const out = [];
    glob(path.join(__dirname, '../web/assets/images/gallery/*.jpg'), async (err, files) => {
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

                await new Promise((res, rej) => {
                    console.log(newWidth, newHeight);
                    gm(file).resize(newWidth, newHeight).stream((err, stdout) => {
                        gm(stdout).size((err, values) => {
                            outObj.thumbnailWidth = values.width;
                            outObj.thumbnailHeight = values.height;
                        }).write(outPath, (err) => {
                            if (err) {
                                console.log(err);
                                rej(err);
                            } else {
                                console.log('resized: ', file);
                                res();
                            }
                        });
                    });
                });

                out.push(outObj);
                resolve();
            })
        }));

        console.log(out);
        fs.writeFile(path.join(__dirname, '../web/assets/data/photos.json'), JSON.stringify(out), (err) => {
            if (err) {
                throw err;
            }
            console.log('The file has been saved!');
        });
    });
}

main();