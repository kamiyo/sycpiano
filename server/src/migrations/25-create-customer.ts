import { DataTypes, QueryInterface } from 'sequelize';
import { customer } from '../models/customer';

export const up = async (queryInterface: QueryInterface, dataTypes: typeof DataTypes) => {
    await queryInterface.createTable<customer>('customer', {
        id: {
            type: dataTypes.STRING,
            primaryKey: true,
            unique: true,
        },
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
    await queryInterface.dropTable('customer');
};
