'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ApiKey extends Model {
    static associate(models) {
      
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
    underscored: true, 
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat'
  });
  
  return ApiKey;
};