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
        shortAuthor: {
            type: dataTypes.STRING,
            field: 'short_author',
        },
        date: dataTypes.STRING,
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
    await queryInterface.dropTable('acclaim');
};
