"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Piece = (sequelize, dataTypes) => {
    const piece = sequelize.define('piece', {
        id: {
            allowNull: false,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            type: dataTypes.UUID,
            unique: true,
        },
        piece: dataTypes.STRING,
    });
    piece.associate = (db) => {
        piece.hasMany(db.calendarPiece);
        piece.belongsToMany(db.calendar, { through: db.calendarPiece });
    };
    return piece;
};
exports.default = Piece;
