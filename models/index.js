'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;

try {
  if (config && config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else if (config) {
    sequelize = new Sequelize(config.database, config.username, config.password, {
      ...config,
      dialectOptions: {
        ...(config.dialectOptions || {}),
        connectTimeout: 2000
      }
    });
  } else {
    sequelize = new Sequelize(
      process.env.DB_DATABASE || 'akhir',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASS || '2025',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: process.env.DB_DIALECT || 'postgres',
        logging: false
      }
    );
  }
} catch (err) {
  console.error('Failed to initialize Sequelize:', err);
}

if (sequelize) {
  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.js' &&
        file.indexOf('.test.js') === -1
      );
    })
    .forEach(file => {
      try {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
      } catch (e) {
        console.error(`Error loading model ${file}:`, e);
      }
    });

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;