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
        website: dataTypes.STRING,
        date: dataTypes.DATEONLY,
        oldDate: {
            type: dataTypes.STRING,
            field: 'old_date',
        },
        hasFullDate: {
            type: dataTypes.BOOLEAN,
            field: 'has_full_date',
        },
    }) as AcclaimModel
);

export default Acclaim;
