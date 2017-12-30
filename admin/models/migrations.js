'use strict';

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('migrations', {
    name: {
      type: DataTypes.STRING,
      primaryKey: true
    },
  }, {
    tableName: 'migrations',

    timestamps: false,
    schema: process.env.DATABASE_SCHEMA,
  });

  Model.associate = (models) => {
  };

  return Model;
};
