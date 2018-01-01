import { DataTypes, QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface, dataTypes: DataTypes) => {
    await queryInterface.createTable('calendarPiece', {
        id: {
            allowNull: false,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            type: dataTypes.UUID,
            unique: true,
        },
        calendarId: {
            type: dataTypes.STRING,
            references: {
                model: 'calendar',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        pieceId: {
            type: dataTypes.UUID,
            references: {
                model: 'piece',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        createdAt: dataTypes.DATE,
        updatedAt: dataTypes.DATE,
    });
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('calendarPiece');
};
