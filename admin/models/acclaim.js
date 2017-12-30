'use strict';

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('acclaim', {
    quote: {
      type: DataTypes.STRING,
    },
    short: {
      type: DataTypes.STRING,
    },
    author: {
      type: DataTypes.STRING,
    },
    shortAuthor: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'acclaim',


    schema: process.env.DATABASE_SCHEMA,
  });

  Model.associate = (models) => {
  };

  return Model;
};

