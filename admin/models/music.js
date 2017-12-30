'use strict';

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('music', {
    composer: {
      type: DataTypes.STRING,
    },
    piece: {
      type: DataTypes.STRING,
    },
    contributors: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'music',


    schema: process.env.DATABASE_SCHEMA,
  });

  Model.associate = (models) => {
    Model.hasMany(models.musicfile);
  };

  return Model;
};

