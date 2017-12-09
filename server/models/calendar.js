const Calendar = (sequelize, DataTypes) => (
    sequelize.define('calendar', {
        UUID: {
            type: DataTypes.STRING,
            field: 'UUID',
        },
        name: {
            type: DataTypes.STRING,
            field: 'name',
        },
        dateTime: {
            type: DataTypes.DATE,
            field: 'dateTime',
        },
        timezone: {
            type: DataTypes.STRING,
            field: 'timezone',
        },
        location: {
            type: DataTypes.STRING,
            field: 'location',
        },
        description: {
            type: DataTypes.TEXT,
            field: 'description',
        },
    })
);

module.exports = Calendar;
