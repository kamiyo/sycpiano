import { DataTypes, Sequelize } from 'sequelize';
import { MusicModel } from 'types';

const Music = (sequelize: Sequelize, dataTypes: DataTypes) => {
    const music = sequelize.define('music', {
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
    }) as MusicModel;

    music.associate = (db) => {
        music.hasMany(db.musicfile);
    };

    return music;
};

export default Music;
