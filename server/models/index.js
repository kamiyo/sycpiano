const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const secret = require('../../secret.js');

const DBName = 'sycpiano';
const username = secret.username;
const password = secret.password;

const sequelize = new Sequelize(DBName, username, password, {
    host: 'localhost',
    dialect: 'mysql',
    pool: { max: 5, min: 0, idle: 10000 },
    define: { freezeTable: true },
});

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

db = Object.assign(db, importModels(sequelize).models);
db.sequelize = sequelize;
// In case we ever want to use a different DB connection.
db.importModels = importModels;

module.exports = db;
