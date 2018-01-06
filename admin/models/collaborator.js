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
    });
    collaborator.associate = (db) => {
        collaborator.hasMany(db.calendarCollaborator);
        collaborator.belongsToMany(db.calendar, { through: db.calendarCollaborator });
    };
    return collaborator;
};
exports.default = Collaborator;
