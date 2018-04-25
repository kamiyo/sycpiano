import { DataTypes, Sequelize } from 'sequelize';
import { MusicFileModel } from 'types';

const MusicFile = (sequelize: Sequelize, dataTypes: DataTypes) => {
    const musicfile = sequelize.define('musicFile', {
        id: {
            allowNull: false,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            type: dataTypes.UUID,
            unique: true,
        },
        name: dataTypes.STRING,
        audioFile: {
            type: dataTypes.STRING,
            field: 'audio_file',
        },
        waveformFile: {
            type: dataTypes.STRING,
            field: 'waveform_file',
        },
        durationSeconds: {
            type: dataTypes.INTEGER,
            field: 'duration_seconds',
        },
        musicId: {
            type: dataTypes.UUID,
            field: 'music_id',
        },
        hash: dataTypes.STRING,
    }, { tableName: 'music_file' }) as MusicFileModel;

    musicfile.associate = (models) => {
        musicfile.belongsTo(models.music);
    };

    return musicfile;
};

export default MusicFile;
