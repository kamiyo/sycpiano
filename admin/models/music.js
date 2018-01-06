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
        createdAt: dataTypes.DATE,
        updatedAt: dataTypes.DATE,
    });
    music.associate = (db) => {
        music.hasMany(db.musicfile);
    };
    return music;
};
exports.default = Music;
