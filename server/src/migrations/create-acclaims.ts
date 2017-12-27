import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface, DataTypes: DataTypes) => {
    await queryInterface.createTable('acclaim', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        quote: DataTypes.TEXT,
        short: DataTypes.TEXT,
        author: DataTypes.STRING,
        shortAuthor: DataTypes.STRING,
        date: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    });
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('acclaim');
};
