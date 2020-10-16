import { DataTypes, Sequelize } from 'sequelize';
import { Model } from '../types';

export class product extends Model {
    readonly id: string;
    readonly sku: string;
    readonly file: string;
    readonly title: string;
    readonly description: string;
    readonly sample: string;
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
        description: dataTypes.TEXT,
        sample: dataTypes.STRING,
    }, {
        sequelize,
        tableName: 'product',
    });

    return product;
};
