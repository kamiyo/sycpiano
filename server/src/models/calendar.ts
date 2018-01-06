import { DataTypes, Sequelize } from 'sequelize';
import { CalendarModel } from 'types';

const Calendar = (sequelize: Sequelize, dataTypes: DataTypes) => {
    console.log(sequelize);
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
    }) as CalendarModel;

    calendar.associate = (db) => {
        calendar.hasMany(db.calendarPiece);
        calendar.hasMany(db.calendarCollaborator);
        calendar.belongsToMany(db.piece, { through: db.calendarPiece });
        calendar.belongsToMany(db.collaborator, { through: db.calendarCollaborator });
    };

    return calendar;
};

export default Calendar;
