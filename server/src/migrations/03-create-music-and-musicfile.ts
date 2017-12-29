import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface, DataTypes: DataTypes) => {
    try {
        await queryInterface.createTable('music', {
            id: {
                allowNull: false,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                type: DataTypes.UUID,
                unique: true,
            },
            composer: DataTypes.STRING,
            piece: DataTypes.STRING,
            contributors: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        });
    } catch (e) {
        console.log(e);
    }
    try {
        await queryInterface.createTable('musicfile', {
            id: {
                allowNull: false,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                type: DataTypes.UUID,
                unique: true,
            },
            name: DataTypes.STRING,
            filePath: DataTypes.STRING,
            waveformPath: DataTypes.STRING,
            durationSeconds: DataTypes.INTEGER,
            musicId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'music',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'NO ACTION',
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        });
    } catch (e) {
        console.log(e);
    }
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('musicfile');
    await queryInterface.dropTable('music');
};
