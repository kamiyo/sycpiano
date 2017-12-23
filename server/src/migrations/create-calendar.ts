import { QueryInterface, DataTypes } from 'sequelize';

export const up = (queryInterface: QueryInterface, DataTypes: DataTypes) => {
    return queryInterface.createTable('calendar', {
        id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.STRING,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        dateTime: {
            type: DataTypes.DATE,
        },
        timezone: {
            type: DataTypes.STRING,
        },
        location: {
            type: DataTypes.STRING,
        },
        collaborators: {
            type: DataTypes.JSON,
        },
        type: {
            type: DataTypes.JSON,
        },
        program: {
            type: DataTypes.JSON,
        },
    });
};

export const down = (queryInterface: QueryInterface) => {
    return queryInterface.dropTable('calendar');
};
