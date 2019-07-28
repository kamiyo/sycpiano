import { DataTypes, Sequelize } from 'sequelize';
import { Model } from '../types';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class token extends Model {
    readonly id: string;
    readonly token: string;
    readonly expires: Date | string;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
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
