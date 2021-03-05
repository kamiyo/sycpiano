import { DataTypes, Sequelize } from 'sequelize';
import { Model } from '../types';

export interface CustomerProductAttributes {
    id: string;
}

export class customerProduct extends Model implements CustomerProductAttributes {
    readonly id: string;
    readonly customerId: string;
    readonly productId: string;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof customerProduct => {
    customerProduct.init({
        id: {
            allowNull: false,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            type: dataTypes.UUID,
            unique: true,
        },
        customerId: {
            type: dataTypes.STRING,
            field: 'customer_id',
        },
        productId: {
            type: dataTypes.STRING,
            field: 'product_id',
        },
    }, {
            sequelize,
            tableName: 'customer_product',
        });

    customerProduct.associate = (models) => {
        customerProduct.belongsTo(models.customer);
        customerProduct.belongsTo(models.product);
    };

    return customerProduct;
};
