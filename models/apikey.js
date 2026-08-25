'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ApiKey extends Model {
    static associate(models) {
      ApiKey.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  ApiKey.init({
    userId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      field: 'userid' // Memetakan atribut userId ke kolom 'userid' di Supabase
    },
    key: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true,
      field: 'key' // Atau sesuaikan dengan nama kolom key/apikey di Supabase kamu
    },
    status: { type: DataTypes.STRING, defaultValue: 'active' }
  }, {
    sequelize,
    modelName: 'ApiKey',
    tableName: 'apikeys', // Nama tabel tanpa underscore di Supabase
    createdAt: 'createdat',
    updatedAt: 'updatedat'
  });
  return ApiKey;
};