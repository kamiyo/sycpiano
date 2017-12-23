import { QueryInterface, DataTypes } from 'sequelize';

export const up = (queryInterface: QueryInterface, DataTypes: DataTypes) => {
    return queryInterface.createTable('acclaims', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        quote: {
            type: DataTypes.TEXT,
        },
        short: {
            type: DataTypes.TEXT,
        },
        author: {
            type: DataTypes.STRING,
        },
        shortAuthor: {
            type: DataTypes.STRING,
        },
        date: {
            type: DataTypes.STRING,
        },
    });
};

export const down = (queryInterface: QueryInterface) => {
    return queryInterface.dropTable('acclaims');
};
