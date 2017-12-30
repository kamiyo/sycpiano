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
        dateTime: dataTypes.DATE,
        timezone: dataTypes.STRING,
        location: dataTypes.STRING,
        type: dataTypes.STRING,
    }) as CalendarModel;

    calendar.associate = (db) => {
        calendar.hasMany(db.calendarDetail);
        calendar.belongsToMany(db.piece, { through: db.calendarDetail });
        calendar.belongsToMany(db.collaborator, { through: db.calendarDetail });
    };

    return calendar;
};

export default Calendar;
