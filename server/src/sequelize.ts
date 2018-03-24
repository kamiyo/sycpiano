import Sequelize from 'sequelize';
import * as Config from './config/config';

// const config = (process.env.NODE_ENV === 'production') ? Config.production : Config.development;
const config = Config.development;

const {
    database,
    username,
    password,
    host,
    port,
    dialect,
    logging,
    define,
} = config;

export const options = {
    database,
    username,
};

export default new Sequelize(database, username, password, {
    host,
    port,
    dialect,
    operatorsAliases: false,        // need to change if we are using operators
    pool: { max: 5, min: 0, idle: 10000 },
    define,
    logging,                 // change to log to output
});
