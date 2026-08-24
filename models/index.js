'use strict';

const Sequelize = require('sequelize');
const pg = require('pg'); // <-- 1. Import pg secara eksplisit agar terbaca oleh Vercel
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
  const connectionString = process.env.DATABASE_URL || (config.use_env_variable ? process.env[config.use_env_variable] : null);

  if (connectionString) {
    sequelize = new Sequelize(connectionString, {
      dialect: 'postgres',
      dialectModule: pg, // <-- 2. Paksa Sequelize menggunakan modul pg ini
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        },
        connectTimeout: 10000
      }
    });
  } else {
    const dbName = process.env.DB_DATABASE || config.database || 'akhir';
    const dbUser = process.env.DB_USER || config.username || 'postgres';
    const dbPass = process.env.DB_PASS || config.password || '2025';
    const dbHost = process.env.DB_HOST || config.host || 'localhost';
    const dbPort = process.env.DB_PORT || config.port || 5432;

    sequelize = new Sequelize(dbName, dbUser, dbPass, {
      host: dbHost,
      port: dbPort,
      dialect: 'postgres',
      dialectModule: pg, // <-- 3. Tambahkan di koneksi lokal juga
      logging: false,
      dialectOptions: { connectTimeout: 10000 }
    });
  }
} catch (err) {
  console.error('Failed to initialize Sequelize connection:', err);
}

const db = {};

if (sequelize) {
  try {
    db.User = require('./user')(sequelize, Sequelize.DataTypes);
    db.ApiKey = require('./apikey')(sequelize, Sequelize.DataTypes);
    db.WeatherLog = require('./weatherlog')(sequelize, Sequelize.DataTypes);

    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });
  } catch (modelErr) {
    console.error('Error loading models:', modelErr);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;