'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ApiKey extends Model {
    static associate(models) {
      if (models.User) {
        ApiKey.belongsTo(models.User, { 
          foreignKey: 'userid',
          targetKey: 'id',
          as: 'user' 
        });
      }
    }
  }
  ApiKey.init({
    userid: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      field: 'userid'
    },
    key: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    }
  }, {
    sequelize,
    modelName: 'ApiKey',
    tableName: 'apikeys', 
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat'
  });
  return ApiKey;
};