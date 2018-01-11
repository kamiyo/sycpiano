"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Photo = (sequelize, dataTypes) => sequelize.define('photo', {
    id: {
        type: dataTypes.UUID,
        defaultValue: dataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    file: dataTypes.TEXT,
    width: dataTypes.INTEGER,
    height: dataTypes.INTEGER,
    thumbnailWidth: {
        type: dataTypes.INTEGER,
        field: 'thumbnail_width',
    },
    thumbnailHeight: {
        type: dataTypes.INTEGER,
        field: 'thumbnail_height',
    },
});
exports.default = Photo;
