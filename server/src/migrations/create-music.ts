import { QueryInterface, DataTypes } from 'sequelize';

export const up = (queryInterface: QueryInterface, DataTypes: DataTypes) => {
    return queryInterface.createTable('music', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.UUID,
            unique: true,
        },
        composer: {
            type: DataTypes.STRING,
        },
        piece: {
            type: DataTypes.STRING,
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        updatedAt: {
            type: DataTypes.DATE
        },
    });
};

export const down = (queryInterface: QueryInterface) => {
    return queryInterface.dropTable('music');
};
