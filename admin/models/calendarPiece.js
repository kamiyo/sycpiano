"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CalendarProgram = (sequelize, dataTypes) => {
    const model = sequelize.define('calendarPiece', {
        id: {
            allowNull: false,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            type: dataTypes.UUID,
            unique: true,
        },
        calendarId: dataTypes.STRING,
        pieceId: dataTypes.UUID,
    });
    model.associate = (db) => {
        model.belongsTo(db.calendar);
        model.belongsTo(db.piece);
    };
    return model;
};
exports.default = CalendarProgram;
