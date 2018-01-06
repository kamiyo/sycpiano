import { DataTypes, Sequelize } from 'sequelize';
import { CalendarPieceModel } from 'types';

const CalendarProgram = (sequelize: Sequelize, dataTypes: DataTypes) => {
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
    }, { tableName: 'calendar_piece'}) as CalendarPieceModel;

    model.associate = (db) => {
        model.belongsTo(db.calendar);
        model.belongsTo(db.piece);
    };

    return model;
};

export default CalendarProgram;
