import { DataTypes, Sequelize } from 'sequelize';
import { MusicFileModel } from 'types';

const MusicFile = (sequelize: Sequelize, dataTypes: DataTypes) => {
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
    }) as MusicFileModel;

    musicfile.associate = (db) => {
        musicfile.belongsTo(db.music);
    };

    return musicfile;
};

export default MusicFile;
