import { DataTypes, Sequelize, HasManyGetAssociationsMixin, HasManySetAssociationsMixin, BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyRemoveAssociationsMixin, BelongsToManyCountAssociationsMixin } from 'sequelize';
import { Model } from '../types';
import { product } from './product';

export interface CustomerAttributes {
    id: string;
}

export class customer extends Model implements CustomerAttributes {
    id: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;

    readonly products?: product[];

    getProducts: HasManyGetAssociationsMixin<product>;
    setProducts: HasManySetAssociationsMixin<product, product['id']>;
    addProduct: BelongsToManyAddAssociationMixin<product, product['id']>;
    addProducts: BelongsToManyAddAssociationsMixin<product, product['id']>;
    removeProduct: BelongsToManyRemoveAssociationMixin<product, product['id']>;
    removeProducts: BelongsToManyRemoveAssociationsMixin<product, product['id']>;
    countProducts: BelongsToManyCountAssociationsMixin;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof customer => {
    customer.init({
            id: {
                type: dataTypes.UUID,
                primaryKey: true,
                unique: true,
            },
        }, {
            sequelize,
            tableName: 'customer',
        }
    );

    customer.associate = (models) => {
        customer.belongsToMany(models.product, { through: models.customerProduct });
    };

    return customer;
};
