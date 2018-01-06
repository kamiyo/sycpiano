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
        calendarId: dataTypes.STRING,
        collaboratorId: dataTypes.UUID,
    });
    model.associate = (db) => {
        model.belongsTo(db.calendar);
        model.belongsTo(db.collaborator);
    };
    return model;
};
exports.default = CalendarCollaborator;
