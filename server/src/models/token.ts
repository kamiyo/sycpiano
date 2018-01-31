import { DataTypes, Sequelize } from 'sequelize';
import { TokenModel } from 'types';

const Token = (sequelize: Sequelize, dataTypes: DataTypes) => (
    sequelize.define('token', {
        id: {
            type: dataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        token: dataTypes.STRING,
        expires: {
            type: dataTypes.DATE,
            allowNull: true,
        }
    }) as TokenModel
);

export default Token;
