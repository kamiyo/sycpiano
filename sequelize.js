const Sequelize = require('sequelize');
const secret = require('./secret.js');
const isProduction = process.env.NODE_ENV === 'production';

require('dotenv').config();

let username;
let password;
let host;
let dbName;

if (!isProduction) {
    host = '127.0.0.1';
    dbName = 'sycpiano';
    username = secret.username;
    password = secret.password;
} else {
    const dbUrl = process.env.DATABASE_URL;
    console.log(process.env.DB_USER);
    if (dbUrl) {
        let entire;
        let port;
        [
            entire,
            username,
            password,
            host,
            port,
            dbName,
        ] = dbUrl.match(/postgres:\/\/(.+):(.+)@(.+):(.+)\/(.+)/);
    } else {
        username = process.env.DB_USER;
        password = process.env.DB_PASS;
        host = process.env.DB_HOST;
        dbName = process.env.DB_NAME;
    }
}

module.exports = new Sequelize(dbName, username, password, {
    host,
    dialect: 'postgres',
    operatorsAliases: false,        // need to change if we are using operators
    pool: { max: 5, min: 0, idle: 10000 },
    define: { freezeTable: true },
    logging: false,                 // change to log to output
});
