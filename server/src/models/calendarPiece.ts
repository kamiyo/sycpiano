import { DataTypes, Sequelize } from 'sequelize';
import { CalendarPieceModel } from 'types';

const CalendarProgram = (sequelize: Sequelize, dataTypes: DataTypes) => {
    const model = sequelize.define('calendarDetail', {
        id: {
            allowNull: false,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            type: dataTypes.UUID,
            unique: true,
        },
        calendarId: dataTypes.STRING,
        pieceId: dataTypes.UUID,
    }) as CalendarPieceModel;

    model.associate = (db) => {
        model.belongsTo(db.calendar);
        model.belongsTo(db.piece);
    };

    return model;
};

export default CalendarProgram;
