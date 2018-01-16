"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Music = (sequelize, dataTypes) => {
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
    });
    music.associate = (models) => {
        music.hasMany(models.musicFile);
    };
    return music;
};
exports.default = Music;
