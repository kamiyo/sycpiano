import { DataTypes, Sequelize } from 'sequelize';
import { CalendarCollaboratorModel } from 'types';

const CalendarCollaborator = (sequelize: Sequelize, dataTypes: DataTypes) => {
    const model = sequelize.define('calendarCollaborator', {
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
        collaboratorId: {
            type: dataTypes.UUID,
            field: 'collaborator_id',
        },
    },  { tableName: 'calendar_collaborator' }) as CalendarCollaboratorModel;

    model.associate = (models) => {
        model.belongsTo(models.calendar);
        model.belongsTo(models.collaborator);
    };

    return model;
};

export default CalendarCollaborator;
