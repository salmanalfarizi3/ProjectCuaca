const crypto = require('crypto');
const { ApiKey } = require('../models');

exports.generateKey = async (req, res) => {
  const generatedKey = 'sk_live_' + crypto.randomBytes(24).toString('hex');
  try {
    const keyData = await ApiKey.create({
      userId: req.user.userId,
      apiKey: generatedKey
    });
    res.status(201).json({ message: 'API Key generated successfully', keyData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};