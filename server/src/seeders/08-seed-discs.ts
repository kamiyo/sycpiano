import * as fs from 'fs';
import * as path from 'path';
import { ModelMap } from 'types';

export const up = async (models: ModelMap): Promise<void> => {
    const model = models.disc;
    const filePath = path.join(__dirname, `../../../web/assets/data/discs.json`);
    try {
        const content = await fs.promises.readFile(filePath, { encoding: 'utf8' });
        const json: Array<{
            [key: string]: any;
        }> = JSON.parse(content);

        await Promise.each(json, async (item) => {
            try {
                await model.create(item, {
                    include: [models.discLink],
                });
            } catch (e) {
                console.log(e);
            }
        });
    } catch (e) {
        console.log(e);
    }
};

export const down = async (models: ModelMap): Promise<number> => {
    return models.disc.destroy({ where: {}, cascade: true });
};
