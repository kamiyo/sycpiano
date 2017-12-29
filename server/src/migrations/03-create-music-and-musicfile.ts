import { DataTypes, QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface, dataTypes: DataTypes) => {
    try {
        await queryInterface.createTable('music', {
            id: {
                allowNull: false,
                defaultValue: dataTypes.UUIDV4,
                primaryKey: true,
                type: dataTypes.UUID,
                unique: true,
            },
            composer: dataTypes.STRING,
            piece: dataTypes.STRING,
            contributors: dataTypes.STRING,
            createdAt: dataTypes.DATE,
            updatedAt: dataTypes.DATE,
        });
    } catch (e) {
        console.log(e);
    }
    try {
        await queryInterface.createTable('musicfile', {
            id: {
                allowNull: false,
                defaultValue: dataTypes.UUIDV4,
                primaryKey: true,
                type: dataTypes.UUID,
                unique: true,
            },
            name: dataTypes.STRING,
            filePath: dataTypes.STRING,
            waveformPath: dataTypes.STRING,
            durationSeconds: dataTypes.INTEGER,
            musicId: {
                type: dataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'music',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'NO ACTION',
            },
            createdAt: dataTypes.DATE,
            updatedAt: dataTypes.DATE,
        });
    } catch (e) {
        console.log(e);
    }
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('musicfile');
    await queryInterface.dropTable('music');
};
