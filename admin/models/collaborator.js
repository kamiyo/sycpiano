"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Collaborator = (sequelize, dataTypes) => {
    const collaborator = sequelize.define('collaborator', {
        id: {
            allowNull: false,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            type: dataTypes.UUID,
            unique: true,
        },
        name: dataTypes.STRING,
        instrument: dataTypes.STRING,
    });
    collaborator.associate = (models) => {
        collaborator.hasMany(models.calendarCollaborator);
        collaborator.belongsToMany(models.calendar, { through: models.calendarCollaborator });
    };
    return collaborator;
};
exports.default = Collaborator;
