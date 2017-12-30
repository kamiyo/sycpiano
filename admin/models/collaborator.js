'use strict';

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('collaborator', {
    name: {
        type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'collaborator',

    schema: process.env.DATABASE_SCHEMA,
  });

  Model.associate = (models) => {
    Model.hasMany(models.calendarDetail);
    Model.belongsToMany(models.calendar, { through: models.calendarDetail });
  };

  return Model;
};

