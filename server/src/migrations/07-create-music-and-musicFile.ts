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
            createdAt: {
                type: dataTypes.DATE,
                field: 'created_at',
            },
            updatedAt: {
                type: dataTypes.DATE,
                field: 'updated_at',
            },
        });
    } catch (e) {
        console.log(e);
    }
    try {
        await queryInterface.createTable('music_file', {
            id: {
                allowNull: false,
                defaultValue: dataTypes.UUIDV4,
                primaryKey: true,
                type: dataTypes.UUID,
                unique: true,
            },
            name: dataTypes.STRING,
            filePath: {
                type: dataTypes.STRING,
                field: 'file_path',
            },
            waveformPath: {
                type: dataTypes.STRING,
                field: 'waveform_path',
            },
            durationSeconds: {
                type: dataTypes.INTEGER,
                field: 'duration_seconds',
            },
            musicId: {
                type: dataTypes.UUID,
                field: 'music_id',
                allowNull: false,
                references: {
                    model: 'music',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            createdAt: {
                type: dataTypes.DATE,
                field: 'created_at',
            },
            updatedAt: {
                type: dataTypes.DATE,
                field: 'updated_at',
            },
        });
    } catch (e) {
        console.log(e);
    }
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('music_file');
    await queryInterface.dropTable('music');
};
