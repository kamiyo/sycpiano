import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface, DataTypes: DataTypes) => {
    await queryInterface.createTable('calendar', {
        id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.STRING,
            unique: true,
        },
        name: DataTypes.STRING,
        dateTime: DataTypes.DATE,
        timezone: DataTypes.STRING,
        location: DataTypes.STRING,
        collaborators: DataTypes.JSON,
        type: DataTypes.JSON,
        program: DataTypes.JSON,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    });
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('calendar');
};
