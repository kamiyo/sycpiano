const Sequelize = require('sequelize');

const isProduction = process.env.NODE_ENV === 'production';

let secret;
let host;
let dbName;

if (!isProduction) {
    secret = require('./secret.js');
    host = '127.0.0.1';
    dbName = 'sycpiano';
} else {
    const dbUrl = process.env.DATABASE_URL;
    const [
        entire,
        username,
        password,
        _host,
        _port,
        _dbName,
    ] = dbUrl.match(/postgres:\/\/(.+):(.+)@(.+):(.+)\/(.+)/);

    secret = { username, password }
    host = _host;
    dbName = _dbName;
}

const username = secret.username;
const password = secret.password;

module.exports = new Sequelize(dbName, username, password, {
    host,
    dialect: 'postgres',
    pool: { max: 5, min: 0, idle: 10000 },
    define: { freezeTable: true },
});
