const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const isProduction = process.env.NODE_ENV === 'production';

let secret;
let host;
let dbName;

if (!isProduction) {
    secret = require('../../secret.js');
    host = 'localhost';
    dbName = 'sycpiano';
} else {
    const dbUrl = process.env.DATABASE_URL;
    const [
        entire,
        username,
        password,
        _host,
        _dbName,
    ] = dbUrl.match(/postgres:\/\/(.+):(.+)@(.+)\/(.+)/);

    secret = { username, password }
    host = _host;
    dbName = _dbName;
}

const username = secret.username;
const password = secret.password;

const sequelize = new Sequelize(dbName, username, password, {
    host,
    dialect: 'postgres',
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

db = Object.assign(db, importModels(sequelize));
db.sequelize = sequelize;
// In case we ever want to use a different DB connection.
db.importModels = importModels;

module.exports = db;
