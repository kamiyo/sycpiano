'use strict';

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('seeders', {
    name: {
      type: DataTypes.STRING,
      primaryKey: true
    },
  }, {
    tableName: 'seeders',

    timestamps: false,
    schema: process.env.DATABASE_SCHEMA,
  });

  Model.associate = (models) => {
  };

  return Model;
};

