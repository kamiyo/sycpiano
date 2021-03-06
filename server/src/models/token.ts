import { DataTypes, Sequelize } from 'sequelize';
import { Model } from '../types';

export class token extends Model {
    readonly id: string;
    readonly token: string;
    readonly expires: Date | string;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof token => {
    token.init({
        id: {
            type: dataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        token: dataTypes.STRING,
        expires: {
            type: dataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'token',
    });

    return token;
};
