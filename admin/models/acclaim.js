"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Acclaim = (sequelize, dataTypes) => sequelize.define('acclaim', {
    id: {
        type: dataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    quote: dataTypes.TEXT,
    short: dataTypes.TEXT,
    author: dataTypes.STRING,
    shortAuthor: dataTypes.STRING,
    date: dataTypes.STRING,
});
exports.default = Acclaim;
