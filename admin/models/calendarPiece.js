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
        calendarId: {
            type: dataTypes.STRING,
            field: 'calendar_id',
        },
        pieceId: {
            type: dataTypes.UUID,
            field: 'piece_id',
        },
    }, { tableName: 'calendar_piece' });
    model.associate = (db) => {
        model.belongsTo(db.calendar);
        model.belongsTo(db.piece);
    };
    return model;
};
exports.default = CalendarProgram;
