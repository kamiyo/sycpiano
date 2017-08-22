const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const sequelize = require('../../sequelize.js');

let db = {};

function importModels(sequelize) {
    const models = {};
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

db = Object.assign(db, importModels(sequelize));
db.sequelize = sequelize;
// In case we ever want to use a different DB connection.
db.importModels = importModels;

module.exports = db;
