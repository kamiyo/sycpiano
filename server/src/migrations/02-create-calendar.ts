import { DataTypes, QueryInterface } from 'sequelize';
import { calendar } from 'models/calendar';

export const up = async (queryInterface: QueryInterface, dataTypes: typeof DataTypes) => {
    await queryInterface.createTable<calendar>('calendar', {
        id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: dataTypes.STRING,
            unique: true,
        },
        name: dataTypes.STRING,
        dateTime: {
            type: dataTypes.DATE,
            field: 'date_time',
        },
        timezone: dataTypes.STRING,
        location: dataTypes.STRING,
        type: dataTypes.STRING,
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
    await queryInterface.dropTable('calendar');
};
