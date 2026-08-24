'use strict';

const Sequelize = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';

let config = {};
try {
  config = require(__dirname + '/../config/config.js')[env] || {};
} catch (e) {
  config = {};
}

let sequelize = null;

try {
  if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: { connectTimeout: 2000 }
    });
  } 
  else if (config.use_env_variable && process.env[config.use_env_variable]) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } 
  else {
    const dbName = process.env.DB_DATABASE || config.database || 'akhir';
    const dbUser = process.env.DB_USER || config.username || 'postgres';
    const dbPass = process.env.DB_PASS || config.password || '2025';
    const dbHost = process.env.DB_HOST || config.host || 'localhost';
    const dbPort = process.env.DB_PORT || config.port || 5432;
    const dbDialect = process.env.DB_DIALECT || config.dialect || 'postgres';

    sequelize = new Sequelize(dbName, dbUser, dbPass, {
      host: dbHost,
      port: dbPort,
      dialect: dbDialect,
      logging: false,
      dialectOptions: { connectTimeout: 2000 }
    });
  }
} catch (err) {
  console.error('Failed to initialize Sequelize:', err);
}

const db = {};

// Load model secara manual agar aman di Vercel Serverless
if (sequelize) {
  db.User = require('./user')(sequelize, Sequelize.DataTypes);
  db.ApiKey = require('./apikey')(sequelize, Sequelize.DataTypes);
  db.WeatherLog = require('./weatherLog')(sequelize, Sequelize.DataTypes);

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;