'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const pg = require('pg');
const process = require('process');
const basename = path.basename(__filename);

// Prioritaskan DATABASE_URL langsung dari Environment Variable Vercel
const connectionString = process.env.DATABASE_URL;

let sequelize = null;

try {
  if (connectionString) {
    // Jalur Server / Cloud (Vercel)
    sequelize = new Sequelize(connectionString, {
      dialect: 'postgres',
      dialectModule: pg,
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
    // Jalur Lokal (Laptop)
    const dbName = process.env.DB_DATABASE || 'akhir';
    const dbUser = process.env.DB_USER || 'postgres';
    const dbPass = process.env.DB_PASS || '2025';
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = process.env.DB_PORT || 5432;

    sequelize = new Sequelize(dbName, dbUser, dbPass, {
      host: dbHost,
      port: dbPort,
      dialect: 'postgres',
      dialectModule: pg,
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
    fs.readdirSync(__dirname)
      .filter(file => {
        return (
          file.indexOf('.') !== 0 &&
          file !== basename &&
          file.slice(-3) === '.js' &&
          file.indexOf('.test.js') === -1
        );
      })
      .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
      });

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