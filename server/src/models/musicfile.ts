import { DataTypes, Sequelize } from 'sequelize';
import { MusicFileModel } from 'types';

const MusicFile = (sequelize: Sequelize, dataTypes: DataTypes) => (
    sequelize.define('musicfile', {
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
        createdAt: dataTypes.DATE,
        updatedAt: dataTypes.DATE,
    }) as MusicFileModel
);

export default MusicFile;
