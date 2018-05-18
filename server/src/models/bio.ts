import { DataTypes, Sequelize } from 'sequelize';
import { BioModel } from 'types';

const Bio = (sequelize: Sequelize, dataTypes: DataTypes) => (
    sequelize.define('bio', {
        paragraph: {
            type: dataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        text: {
            type: dataTypes.TEXT,
            allowNull: false,
        },
        createdAt: {
            type: dataTypes.DATE,
            field: 'created_at',
        },
        updatedAt: {
            type: dataTypes.DATE,
            field: 'updated_at',
        },
    }) as BioModel
);

export default Bio;
