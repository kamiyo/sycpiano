import { DataTypes, Sequelize } from 'sequelize';
import { CalendarModel } from 'types';

const Calendar = (sequelize: Sequelize, dataTypes: DataTypes) => {
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
        allDay: {
            type: dataTypes.BOOLEAN,
            field: 'all_day',
        },
        endDate: {
            type: dataTypes.DATE,
            field: 'end_date',
        },
        timezone: dataTypes.STRING,
        location: dataTypes.STRING,
        type: dataTypes.STRING,
        website: dataTypes.STRING,
    }) as CalendarModel;

    calendar.associate = (models) => {
        calendar.hasMany(models.calendarPiece);
        calendar.hasMany(models.calendarCollaborator);
        calendar.belongsToMany(models.piece, { through: models.calendarPiece });
        calendar.belongsToMany(models.collaborator, { through: models.calendarCollaborator });
    };

    return calendar;
};

export default Calendar;
