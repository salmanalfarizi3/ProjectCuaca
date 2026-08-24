const crypto = require('crypto');

let ApiKey;
try {
  const models = require('../models');
  ApiKey = models.ApiKey;
} catch (e) {
  ApiKey = null;
}

exports.generateKey = async (req, res) => {
  const generatedKey = 'sk_live_' + crypto.randomBytes(24).toString('hex');
  try {
    if (!ApiKey || !ApiKey.create) {
      return res.status(201).json({ 
        message: 'API Key generated successfully (Simulasi DB)', 
        keyData: { id: 1, userId: req.user?.userId || 1, apiKey: generatedKey } 
      });
    }

    const keyData = await ApiKey.create({
      userId: req.user.userId,
      apiKey: generatedKey
    });
    res.status(201).json({ message: 'API Key generated successfully', keyData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};