'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ApiKey extends Model {
    static associate(models) {
      // Tambahkan 'field: userid' pada foreignKey relasi
      ApiKey.belongsTo(models.User, { 
        foreignKey: {
          name: 'userId',
          field: 'userid'
        }, 
        as: 'user' 
      });
    }
  }
  ApiKey.init({
    userId: { 
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
    createdAt: 'createdat',
    updatedAt: 'updatedat'
  });
  return ApiKey;
};