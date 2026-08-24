const { ApiKey } = require('../models');

module.exports = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;

  if (!apiKey) {
    return res.status(401).json({ message: 'API Key is required' });
  }

  try {
    if (ApiKey && ApiKey.findOne) {
      const foundKey = await ApiKey.findOne({ where: { key: apiKey, active: true } });
      if (!foundKey) {
        return res.status(403).json({ message: 'Invalid or inactive API Key' });
      }
    }
    next();
  } catch (error) {
    console.error('API Key Middleware DB Error:', error.message);
    next();
  }
};