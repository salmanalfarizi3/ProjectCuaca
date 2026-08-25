const crypto = require('crypto');

let db;
try {
  db = require('../models');
} catch (e) {
  db = null;
}

exports.generateKey = async (req, res) => {
  const generatedKey = 'sk_live_' + crypto.randomBytes(24).toString('hex');
  const currentUserId = req.user?.id || req.user?.userId || req.user?.userid || 1;

  try {
    if (!db || !db.sequelize) {
      return res.status(201).json({
        message: 'API Key generated successfully (Simulasi DB)',
        keyData: { id: 1, userid: currentUserId, key: generatedKey }
      });
    }

    // Samakan placeholder :userid dengan key replacement
    const [result] = await db.sequelize.query(
      `INSERT INTO apikeys (userid, key, createdat, updatedat) 
       VALUES (:userid, :key, NOW(), NOW()) 
       RETURNING id, userid, key, createdat`,
      {
        replacements: { userid: currentUserId, key: generatedKey },
        type: db.sequelize.QueryTypes.INSERT
      }
    );

    return res.status(201).json({
      message: 'API Key generated successfully',
      keyData: result[0] || { userid: currentUserId, key: generatedKey }
    });

  } catch (err) {
    console.error("Detail Error Generate Key:", err);
    return res.status(500).json({ error: err.message });
  }
};