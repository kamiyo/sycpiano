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
        composer: dataTypes.STRING,
        piece: dataTypes.STRING,
    });
    piece.associate = (models) => {
        piece.hasMany(models.calendarPiece);
        piece.belongsToMany(models.calendar, { through: models.calendarPiece });
    };
    return piece;
};
exports.default = Piece;
