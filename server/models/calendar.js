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
        collaborators: {
            type: DataTypes.JSON,
            field: 'collaborators',
        },
        type: {
            type: DataTypes.JSON,
            field: 'type',
        },
        program: {
            type: DataTypes.JSON,
            field: 'program',
        },
    })
);

module.exports = Calendar;
