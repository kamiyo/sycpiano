"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CalendarCollaborator = (sequelize, dataTypes) => {
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
        order: dataTypes.INTEGER,
    }, { tableName: 'calendar_collaborator' });
    model.associate = (models) => {
        model.belongsTo(models.calendar);
        model.belongsTo(models.collaborator);
    };
    return model;
};
exports.default = CalendarCollaborator;
