"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Calendar = (sequelize, dataTypes) => {
    const calendar = sequelize.define('calendar', {
        id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: dataTypes.STRING,
            unique: true,
        },
        name: dataTypes.STRING,
        dateTime: {
            type: dataTypes.DATE,
            field: 'date_time',
        },
        timezone: dataTypes.STRING,
        location: dataTypes.STRING,
        type: dataTypes.STRING,
        website: dataTypes.STRING,
    });
    calendar.associate = (models) => {
        calendar.hasMany(models.calendarPiece);
        calendar.hasMany(models.calendarCollaborator);
        calendar.belongsToMany(models.piece, { through: models.calendarPiece });
        calendar.belongsToMany(models.collaborator, { through: models.calendarCollaborator });
    };
    return calendar;
};
exports.default = Calendar;
