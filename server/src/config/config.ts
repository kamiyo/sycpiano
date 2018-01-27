/*tslint:disable:no-var-requires*/
require('dotenv').config();
/*tslint:disable:no-var-requires*/

export const development = {
    host: '127.0.0.1',
    database: 'sycpiano',
    port: 5432,    // default
    username: require('../secret').default.username,
    password: require('../secret').default.password,
    dialect: 'postgres',
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
    let dialect: string;
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
        let entire;
        let portString;
        [
            entire,
            username,
            password,
            host,
            portString,
            database,
        ] = dbUrl.match(/postgres:\/\/(.+):(.+)@(.+):(.+)\/(.+)/);
        port = parseInt(portString, 10);
        dialect = 'postgres';
    } else {
        username = process.env.DB_USER;
        password = process.env.DB_PASS;
        host = process.env.DB_HOST;
        database = process.env.DB_NAME;
        port = parseInt(process.env.DB_PORT, 10);
        dialect = process.env.DB_DIALECT;
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
