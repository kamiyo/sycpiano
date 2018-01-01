import { DataTypes, Sequelize } from 'sequelize';
import { CalendarCollaboratorModel } from 'types';

const CalendarCollaborator = (sequelize: Sequelize, dataTypes: DataTypes) => {
    const model = sequelize.define('calendarDetail', {
        id: {
            allowNull: false,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            type: dataTypes.UUID,
            unique: true,
        },
        calendarId: dataTypes.STRING,
        collaboratorId: dataTypes.UUID,
    }) as CalendarCollaboratorModel;

    model.associate = (db) => {
        model.belongsTo(db.calendar);
        model.belongsTo(db.collaborator)
    };

    return model;
};

export default CalendarCollaborator;
