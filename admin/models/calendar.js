'use strict';

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('calendar', {
    name: {
      type: DataTypes.STRING,
    },
    dateTime: {
      type: DataTypes.DATE,
    },
    timezone: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'calendar',

    schema: process.env.DATABASE_SCHEMA,
  });

  Model.associate = (models) => {
    Model.hasMany(models.calendarDetail);
    Model.belongsToMany(models.piece, { through: models.calendarDetail });
    Model.belongsToMany(models.collaborator, { through: models.calendarDetail });
  };

  return Model;
};

