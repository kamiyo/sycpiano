import { DataTypes, Sequelize } from 'sequelize';
import { Model } from '../types';

export class product extends Model {
    readonly id: string;
    readonly sku: string;
    readonly file: string;
    readonly title: string;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
    product.init({
        id: {
            type: dataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: dataTypes.UUIDV4,
            unique: true,
        },
        sku: dataTypes.STRING,
        file: dataTypes.STRING,
        title: dataTypes.TEXT,
    }, {
        sequelize,
        tableName: 'product',
    });

    return product;
};
