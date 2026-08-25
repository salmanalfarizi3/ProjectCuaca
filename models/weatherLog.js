'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WeatherLog extends Model {
    static associate(models) {}
  }
  WeatherLog.init({
    city: { type: DataTypes.STRING, allowNull: false },
    country: { type: DataTypes.STRING, allowNull: false },
    temperature: { type: DataTypes.DECIMAL(4, 1), allowNull: false },
    humidity: { type: DataTypes.INTEGER, allowNull: false },
    windSpeed: { type: DataTypes.DECIMAL(4, 1), allowNull: false },
    weatherCondition: { type: DataTypes.STRING, allowNull: false },
    airQualityIndex: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'weatherLog',
    tableName: 'weather_logs'
  });
  return WeatherLog;
};