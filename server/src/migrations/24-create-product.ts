import { DataTypes, QueryInterface } from 'sequelize';
import { product } from '../models/product';

export const up = async (queryInterface: QueryInterface, dataTypes: typeof DataTypes) => {
    await queryInterface.createTable<product>('product', {
        id: {
            type: dataTypes.STRING,
            primaryKey: true,
            unique: true,
        },
        name: dataTypes.STRING,
        file: dataTypes.STRING,
        description: dataTypes.TEXT,
        sample: dataTypes.STRING,
        images: dataTypes.ARRAY(dataTypes.STRING),
        pages: dataTypes.INTEGER,
        price: dataTypes.INTEGER,
        createdAt: {
            type: dataTypes.DATE,
            field: 'created_at',
        },
        updatedAt: {
            type: dataTypes.DATE,
            field: 'updated_at',
        },
    });
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('product');
};
