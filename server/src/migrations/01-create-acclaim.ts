import { DataTypes, QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface, dataTypes: DataTypes) => {
    await queryInterface.createTable('acclaim', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: dataTypes.INTEGER,
        },
        quote: dataTypes.TEXT,
        short: dataTypes.TEXT,
        author: dataTypes.STRING,
        shortAuthor: dataTypes.STRING,
        date: dataTypes.STRING,
        createdAt: dataTypes.DATE,
        updatedAt: dataTypes.DATE,
    });
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('acclaim');
};
