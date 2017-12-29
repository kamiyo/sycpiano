import { DataTypes, QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface, dataTypes: DataTypes) => {
    await queryInterface.createTable('calendar', {
        id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: dataTypes.STRING,
            unique: true,
        },
        name: dataTypes.STRING,
        dateTime: dataTypes.DATE,
        timezone: dataTypes.STRING,
        location: dataTypes.STRING,
        collaborators: dataTypes.JSON,
        type: dataTypes.JSON,
        program: dataTypes.JSON,
        createdAt: dataTypes.DATE,
        updatedAt: dataTypes.DATE,
    });
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('calendar');
};
