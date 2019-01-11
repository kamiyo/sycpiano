import * as fs from 'fs';
import * as path from 'path';
import { ModelMap } from 'types';

export const up = async (models: ModelMap) => {
    const model = models.disc;
    const filePath = path.join(__dirname, `../../../web/assets/data/discs.json`);
    return fs.readFile(filePath, (err: NodeJS.ErrnoException, content: any) => {
        if (err) {
            console.log(err);
        }
        const json: Array<{
            [key: string]: any,
        }> = JSON.parse(content);

        json.forEach(async (item) => {
            try {
                await model.create(item, {
                    include: [models.discLink],
                });
            } catch (e) {
                console.log(e);
            }
        });
    });
};

export const down = async (models: ModelMap) => {
    return models.disc.destroy({ where: {}, cascade: true });
};
