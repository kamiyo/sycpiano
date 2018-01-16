"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MusicFile = (sequelize, dataTypes) => {
    const musicfile = sequelize.define('musicFile', {
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
        },
    }, { tableName: 'music_file' });
    musicfile.associate = (models) => {
        musicfile.belongsTo(models.music);
    };
    return musicfile;
};
exports.default = MusicFile;
