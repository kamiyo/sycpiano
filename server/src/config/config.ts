import * as dotenv from 'dotenv';
import { Dialect } from 'sequelize/types';
dotenv.config();

export const development = {
    host: '127.0.0.1',
    database: 'sycpiano',
    port: 5432,    // default
    username: require('../secret').default.username,
    password: require('../secret').default.password,
    dialect: 'postgres' as Dialect,
    logging: (str: string) => {
        console.log(str);
    },
    define: { freezeTableName: true, underscored: true },
};

const config = () => {
    let username: string;
    let password: string;
    let host: string;
    let database: string;
    let port: number;
    let dialect: Dialect;
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
        let portString;
        [
            ,
            username,
            password,
            host,
            portString,
            database    // eslint-disable-line comma-dangle
        ] = dbUrl.match(/postgres:\/\/(.+):(.+)@(.+):(.+)\/(.+)/);
        port = parseInt(portString, 10);
        dialect = 'postgres';
    } else {
        username = process.env.DB_USER;
        password = process.env.DB_PASS;
        host = process.env.DB_HOST;
        database = process.env.DB_NAME;
        port = parseInt(process.env.DB_PORT, 10);
        dialect = process.env.DB_DIALECT as Dialect;
    }
    return {
        username,
        password,
        host,
        database,
        port,
        dialect,
        logging: () => { return; },
        define: { freezeTableName: true, underscored: true },
    };
};

export const test = config();
export const production = config();
