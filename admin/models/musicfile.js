"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MusicFile = (sequelize, dataTypes) => {
    const musicfile = sequelize.define('musicfile', {
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
    });
    musicfile.associate = (db) => {
        musicfile.belongsTo(db.music);
    };
    return musicfile;
};
exports.default = MusicFile;
