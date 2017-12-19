import Sequelize from 'sequelize';
import secret from './secret';
const isProduction = process.env.NODE_ENV === 'production';

require('dotenv').config();

let username;
let password;
let host;
let dbName;
let port: number;

if (!isProduction) {
    host = '127.0.0.1';
    dbName = 'sycpiano';
    port = 5432;    // default
    username = secret.username;
    password = secret.password;
} else {
    const dbUrl = process.env.DATABASE_URL;
    console.log(process.env.DB_USER);
    if (dbUrl) {
        let entire;
        let portString;
        [
            entire,
            username,
            password,
            host,
            portString,
            dbName,
        ] = dbUrl.match(/postgres:\/\/(.+):(.+)@(.+):(.+)\/(.+)/);
        port = parseInt(portString);
    } else {
        username = process.env.DB_USER;
        password = process.env.DB_PASS;
        host = process.env.DB_HOST;
        dbName = process.env.DB_NAME;
        port = parseInt(process.env.DB_PORT);
    }
}

export default new Sequelize(dbName, username, password, {
    host,
    port,
    dialect: 'postgres',
    operatorsAliases: false,        // need to change if we are using operators
    pool: { max: 5, min: 0, idle: 10000 },
    define: { freezeTable: true } as any,
    logging: false,                 // change to log to output
});
