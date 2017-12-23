import { QueryInterface } from 'sequelize';
import * as fs from 'fs';
import * as path from 'path';
import { omit } from 'lodash';

export const up = async (queryInterface: QueryInterface) => {
    const filePath = path.join(__dirname, '../../../web/assets/data/acclaim.json');
    fs.readFile(filePath, (err: NodeJS.ErrnoException, content: any) => {
        if (err) {
            console.log(err);
        }
        const json: {
            [key: string]: any
         }[] = JSON.parse(content);

        const items = json.map((obj) => omit(obj, ['ID']));
        return queryInterface.bulkInsert('acclaims', items);
    });
};

export const down = async (queryInterface: QueryInterface) => {
    return queryInterface.bulkDelete('acclaims', null);
};
