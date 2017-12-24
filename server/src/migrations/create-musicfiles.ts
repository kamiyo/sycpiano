import { QueryInterface, DataTypes } from 'sequelize';

export const up = (queryInterface: QueryInterface, DataTypes: DataTypes) => {
    return queryInterface.createTable('musicFiles', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.UUID,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        filePath: {
            type: DataTypes.STRING,
        },
        pathToWaveform: {
            type: DataTypes.STRING,
        },
        durationSeconds: {
            type: DataTypes.INTEGER,
        },
        music_id: {
            type: DataTypes.UUID,
            references: {
                model: 'music',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'NO ACTION',
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
