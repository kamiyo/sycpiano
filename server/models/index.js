const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const sequelize = require('../../sequelize.js');

let db = {};

function importModels(sequelize) {
    const models = {};
    const modelFiles = fs.readdirSync(__dirname);
    modelFiles.forEach(file => {
        if (file === 'index.js') return;

        const model = sequelize.import(path.join(__dirname, file));
        // Let's make the model key title-cased.
        models[_.startCase(model.name)] = model;
    });
    return models;
}

db = Object.assign(db, importModels(sequelize));
db.sequelize = sequelize;
// In case we ever want to use a different DB connection.
db.importModels = importModels;

module.exports = db;
