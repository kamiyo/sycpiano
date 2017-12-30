import * as fs from 'fs';
import * as path from 'path';
import { ModelMap } from 'types';

export const up = async (models: ModelMap) => {
    const model = models.music;
    const filePath = path.join(__dirname, '../../../web/assets/data/music.json');
    return fs.readFile(filePath, (err: NodeJS.ErrnoException, content: any) => {
        if (err) {
            console.log(err);
        }
        const json: Array<{
            [key: string]: any,
        }> = JSON.parse(content);

        json.forEach(async (item) => {
            console.log(item);
            await model.create(item, {
                include: [models.musicfile],
            });
        });
    });
};

export const down = async (models: ModelMap) => {
    return models.music.destroy({ where: {}, cascade: true });
};
