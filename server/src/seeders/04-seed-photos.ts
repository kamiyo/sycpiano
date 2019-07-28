import * as fs from 'fs';
import * as path from 'path';
import { ModelMap } from 'types';

export const up = async (models: ModelMap) => {
    const model = models.photo;
    const filePath = path.join(__dirname, '../../../web/assets/data/photos.json');
    fs.readFile(filePath, (err: NodeJS.ErrnoException, content: any) => {
        if (err) {
            console.log(err);
        }
        const json: {
            [key: string]: any,
        }[] = JSON.parse(content);

        return model.bulkCreate(json);
    });
};

export const down = async (models: ModelMap) => {
    return models.photo.destroy({ truncate: true });
};
