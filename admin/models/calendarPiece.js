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
        order: dataTypes.INTEGER,
    }, { tableName: 'calendar_piece' });
    model.associate = (models) => {
        model.belongsTo(models.calendar);
        model.belongsTo(models.piece);
    };
    return model;
};
exports.default = CalendarProgram;
