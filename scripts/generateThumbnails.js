const Promise = require('bluebird');
const glob = require('glob');
const fs = require('fs');
const gm = require('gm');
const path = require('path');

function main() {
    glob(path.join(__dirname, '../web/assets/images/gallery/*.jpg'), (err, files) => {
        files.forEach(async (file) => {
            const pathObject = path.parse(file);
            const outPath = path.join(pathObject.dir, 'thumbnails', pathObject.base);
            const { width, height } = gm(file).size((err, values) => {
                if (err) {
                    console.log(err);
                } else {
                    return values;
                }
            });
            if (height >= width) {
                const newHeight = 600;
                gm(file).resize(null, newHeight).write(outPath, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('resized: ', file);
                    }
                });
            } else {
                const newWidth = 600;
                gm(file).resize(newWidth).write(outPath, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('resized: ', file);
                    }
                });
            }
        });
    });
}

main();