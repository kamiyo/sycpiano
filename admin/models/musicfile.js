'use strict';

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('musicfile', {
    name: {
      type: DataTypes.STRING,
    },
    filePath: {
      type: DataTypes.STRING,
    },
    waveformPath: {
      type: DataTypes.STRING,
    },
    durationSeconds: {
      type: DataTypes.INTEGER,
    },
    musicId: {
      type: DataTypes.UUID,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'musicfile',


    schema: process.env.DATABASE_SCHEMA,
  });

  Model.associate = (models) => {
    Model.belongsTo(models.music);
  };

  return Model;
};

