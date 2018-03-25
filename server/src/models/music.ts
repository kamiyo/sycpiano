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
        type: dataTypes.STRING,
        year: dataTypes.INTEGER,
    }) as MusicModel;

    music.associate = (models) => {
        music.hasMany(models.musicFile);
    };

    return music;
};

export default Music;
