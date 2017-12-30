import { DataTypes, Sequelize } from 'sequelize';
import { CalendarDetailModel } from 'types';

const CalendarDetail = (sequelize: Sequelize, dataTypes: DataTypes) => {
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
        collaboratorId: dataTypes.UUID,
    }) as CalendarDetailModel;

    model.associate = (db) => {
        model.belongsTo(db.calendar);
        model.belongsTo(db.collaborator);
        model.belongsTo(db.piece);
    };

    return model;
};

export default CalendarDetail;
