const { ApiKey } = require('../models');

module.exports = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return res.status(401).json({ message: 'X-API-KEY header missing' });

  try {
    const keyInfo = await ApiKey.findOne({ where: { apiKey, status: 'active' } });
    if (!keyInfo) return res.status(403).json({ message: 'Invalid or inactive API Key' });
    
    req.apiKeyInfo = keyInfo;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};