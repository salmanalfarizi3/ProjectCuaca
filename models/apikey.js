'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ApiKey extends Model {
    static associate(models) {
      ApiKey.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  ApiKey.init({
    userId: { type: DataTypes.INTEGER, allowNull: false },
    apiKey: { type: DataTypes.STRING, allowNull: false, unique: true },
    status: { type: DataTypes.STRING, defaultValue: 'active' }
  }, {
    sequelize,
    modelName: 'ApiKey',
    tableName: 'api_keys'
  });
  return ApiKey;
};