import { Sequelize, DataTypes } from 'sequelize';
import { MusicModel } from 'types';

const Music = (sequelize: Sequelize, DataTypes: DataTypes) => {
    const music = sequelize.define('music', {
        id: {
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            type: DataTypes.UUID,
            unique: true,
        },
        composer: DataTypes.STRING,
        piece: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    }) as MusicModel;

    music.associate = (db) => {
        music.hasMany(db.musicFile);
    };

    return music;
};

export default Music;
