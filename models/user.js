'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ApiKey extends Model {
    static associate(models) {
      if (models.User) {
        ApiKey.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      }
    }
  }
  ApiKey.init({
    key: { type: DataTypes.STRING, allowNull: false, unique: true },
    userId: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'ApiKey',
    tableName: 'apikeys', 
    createdAt: 'createdat',
    updatedat: 'updatedat'
  });
  return ApiKey;
};