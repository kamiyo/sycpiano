import * as fs from 'fs';
import * as path from 'path';
import { ModelMap } from 'types';

const isDev = process.env.NODE_ENV !== 'production';

export const up = async (models: ModelMap) => {
    const model = models.music;
    const filePath = path.join(__dirname, `../../../web/assets/data/music${isDev ? '_example' : ''}.json`);
    return fs.readFile(filePath, (err: NodeJS.ErrnoException, content: any) => {
        if (err) {
            console.log(err);
        }
        const json: Array<{
            [key: string]: any;
        }> = JSON.parse(content);

        json.forEach(async (item) => {
            try {
                await model.create(item, {
                    include: [models.musicFile],
                });
            } catch (e) {
                console.log(e);
            }
        });
    });
};

export const down = async (models: ModelMap) => {
    return models.music.destroy({ where: {}, cascade: true });
};
