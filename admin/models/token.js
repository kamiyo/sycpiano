"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Token = (sequelize, dataTypes) => sequelize.define('token', {
    id: {
        type: dataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    token: dataTypes.STRING,
    expires: {
        type: dataTypes.DATE,
        allowNull: true,
    },
});
exports.default = Token;
