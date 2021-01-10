import { DataTypes, Sequelize, CreateOptions, UpdateOptions } from 'sequelize';
import { createProduct, updateProduct } from '../stripe';
import { Model } from '../types';

export const ProductTypes = ['arrangement', 'cadenza', 'original'] as const;

export interface ProductAttributes {
    id: string;
    file: string;
    name: string;
    permalink: string;
    description: string;
    sample: string;
    images: string[];
    pages: number;
    price: number; // in cents
    priceID: string;
    type: typeof ProductTypes[number];
}

export class product extends Model implements ProductAttributes {
    id: string;
    file: string;
    name: string;
    permalink: string;
    description: string;
    sample: string;
    images: string[];
    pages: number;
    price: number; // in cents
    priceID: string;
    type: typeof ProductTypes[number];
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

const beforeCreateHook = async (p: product, _: CreateOptions) => {
    try {
        const [productID, priceID] = await createProduct(p);
        p.id = productID;
        p.priceID = priceID;
    } catch (e) {
        console.log('Failed to get IDs for new product', e);
    }
};

const beforeUpdateHook = async (p: product, _: UpdateOptions) => {
    try {
        const [productID, priceID] = await updateProduct(p);
        p.id = productID;
        p.priceID = priceID;
    } catch (e) {
        console.log('Failed to get IDs for updated product', e);
    }
};

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
    product.init({
            id: {
                type: dataTypes.STRING,
                primaryKey: true,
                unique: true,
            },
            name: dataTypes.STRING,
            permalink: dataTypes.STRING,
            file: dataTypes.STRING,
            images: dataTypes.ARRAY(dataTypes.STRING),
            description: dataTypes.TEXT,
            sample: dataTypes.STRING,
            pages: dataTypes.INTEGER,
            price: dataTypes.INTEGER,
            priceID: {
                type: dataTypes.STRING,
                field: 'price_id',
            },
            type: {
                type: dataTypes.STRING,
                validate: {
                    isIn: [[...ProductTypes]]
                }
            }
        }, {
            sequelize,
            tableName: 'product',
            hooks: {
                beforeCreate: beforeCreateHook,
                beforeUpdate: beforeUpdateHook,
            },
        }
    );

    product.associate = (models) => {
        product.belongsToMany(models.customer, { through: models.customerProduct });
    };

    return product;
};
