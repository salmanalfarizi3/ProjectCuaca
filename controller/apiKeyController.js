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
  
  // Mengambil ID user dari token JWT (bisa req.user.id atau req.user.userId)
  const currentUserId = req.user?.id || req.user?.userId || req.user?.id_user;

  if (!currentUserId) {
    return res.status(400).json({ 
      error: 'User ID tidak ditemukan pada token JWT. Silakan Login ulang.' 
    });
  }

  try {
    if (!ApiKey || !ApiKey.create) {
      return res.status(201).json({ 
        message: 'API Key generated successfully (Simulasi DB)', 
        keyData: { id: 1, userId: currentUserId, key: generatedKey } 
      });
    }

    const keyData = await ApiKey.create({
      userId: currentUserId,
      key: generatedKey
    });

    res.status(201).json({ message: 'API Key generated successfully', keyData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};