const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const sequelize = require('../../sequelize.js');

/**
 * Loops through a list of model files, and transforms them into a map that
 * maps each model name to the corresponding sequelize model.
 */
const importModels = (sequelize) => {
    const modelFiles = fs.readdirSync(__dirname);

    return modelFiles.reduce((runningMap, file) => {
        if (file === 'index.js') return runningMap;

        const model = sequelize.import(path.join(__dirname, file));
        return {
            ...runningMap,
            // Let's make the model key title-cased.
            [_.startCase(model.name)]: model,
        };
    }, {});
}

const db = {
    ...importModels(sequelize),
    sequelize,
    // Export the function, in case we ever want to use it with
    // a different DB connection.
    importModels,
};

module.exports = db;
