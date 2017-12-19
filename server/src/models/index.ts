import { startCase } from 'lodash';
import * as fs from 'fs';
import * as path from 'path';
import sequelizer from '../sequelizer';
import { Sequelize, Model } from 'sequelize';

/**
 * Loops through a list of model files, and transforms them into a map that
 * maps each model name to the corresponding sequelize model.
 */

interface ModelMap {
    [name: string]: Model<{}, {}>;
}

interface ModelWithName<TI, TA> extends Model<TI, TA> {
    name: string;
}

const importModels = (sequelizer: Sequelize): ModelMap => {
    const modelFiles = fs.readdirSync(__dirname);

    return modelFiles.reduce((runningMap, file) => {
        if (file === 'index.ts' || file === 'index.js') return runningMap;

        const model: ModelWithName<{}, {}> = sequelizer.import(path.join(__dirname, file)) as ModelWithName<{}, {}>;
        return {
            ...runningMap,
            // Let's make the model key title-cased.
            [startCase(model.name)]: model,
        };
    }, {});
}

const db = Object.assign({
    sequelizer,
    // Export the function, in case we ever want to use it with
    // a different DB connection.
    importModels,
}, importModels(sequelizer));

export default db;
