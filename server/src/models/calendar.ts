import { DataTypes, Sequelize } from 'sequelize';
import { CalendarModel } from 'types';

const Calendar = (sequelize: Sequelize, dataTypes: DataTypes) => (
    sequelize.define('calendar', {
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
        collaborators: dataTypes.JSON,
        type: dataTypes.JSON,
        program: dataTypes.JSON,
    }) as CalendarModel
);

export default Calendar;
