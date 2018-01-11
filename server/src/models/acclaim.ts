import { DataTypes, Sequelize } from 'sequelize';
import { AcclaimModel } from 'types';

const Acclaim = (sequelize: Sequelize, dataTypes: DataTypes) => (
    sequelize.define('acclaim', {
        id: {
            type: dataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        quote: dataTypes.TEXT,
        short: dataTypes.TEXT,
        author: dataTypes.STRING,
        shortAuthor: {
            type: dataTypes.STRING,
            field: 'short_author',
        },
        date: dataTypes.STRING,
    }) as AcclaimModel
);

export default Acclaim;
