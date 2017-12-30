'use strict';

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('calendarDetail', {
        calendarId: {
            type: DataTypes.UUID,
        },
        pieceId: {
            type: DataTypes.UUID,
        },
        collaboratorId: {
            type: DataTypes.UUID,
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        updatedAt: {
            type: DataTypes.DATE,
        },
    }, {
            tableName: 'calendarDetail',

            schema: process.env.DATABASE_SCHEMA,
        });

    Model.associate = (models) => {
        Model.belongsTo(models.calendar);
        Model.belongsTo(models.collaborator);
        Model.belongsTo(models.piece);
    };

    return Model;
};

