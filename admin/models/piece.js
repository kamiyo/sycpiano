'use strict';

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('piece', {
    piece: {
        type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'piece',

    schema: process.env.DATABASE_SCHEMA,
  });

  Model.associate = (models) => {
    Model.hasMany(models.calendarDetail);
    Model.belongsToMany(models.calendar, { through: models.calendarDetail });
  };

  return Model;
};

