'use strict';
const db = require('../models');
const ApiKey = db.ApiKey;

const apiKeyMiddleware = async (req, res, next) => {
  try {
    const key = req.headers['x-api-key'] || req.query.api_key;

    if (!key) {
      return res.status(401).json({
        status: 'error',
        message: 'API Key tidak ditemukan. Harap sertakan header x-api-key.'
      });
    }

    const foundKey = await ApiKey.findOne({ where: { key: key } });

    if (!foundKey) {
      return res.status(403).json({
        status: 'error',
        message: 'API Key tidak valid.'
      });
    }

    req.apiKeyData = foundKey;
    next();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memvalidasi API Key',
      error: error.message
    });
  }
};

module.exports = apiKeyMiddleware;