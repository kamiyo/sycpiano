import * as fs from 'fs';
import { omit } from 'lodash';
import * as path from 'path';
import { ModelMap } from 'types';

export const up = async (models: ModelMap) => {
    const model = models.acclaim;
    const filePath = path.join(__dirname, '../../../web/assets/data/acclaim.json');
    fs.readFile(filePath, (err: NodeJS.ErrnoException, content: any) => {
        if (err) {
            console.log(err);
        }
        const json: Array<{
            [key: string]: any;
        }> = JSON.parse(content);

        const items = json.map((obj) => omit(obj, ['ID']));
        return model.bulkCreate(items);
    });
};

export const down = async (models: ModelMap) => {
    return models.acclaim.destroy({ truncate: true });
};
