const crypto = require('crypto');

let db;
try {
  db = require('../models');
} catch (e) {
  db = null;
}

exports.generateKey = async (req, res) => {
  const generatedKey = 'sk_live_' + crypto.randomBytes(24).toString('hex');
  const currentUserId = req.user?.id || req.user?.userid || 1;

  try {
    if (!db || !db.sequelize) {
      return res.status(201).json({
        message: 'API Key generated successfully (Simulasi DB)',
        keyData: { id: 1, userid: currentUserId, key: generatedKey }
      });
    }

    // Gunakan QueryTypes.SELECT agar hasil RETURNING langsung berupa Array Objek tunggal [ { id, userid, key, createdat } ]
    const results = await db.sequelize.query(
      `INSERT INTO apikeys (userid, key, createdat, updatedat) 
       VALUES (:userid, :key, NOW(), NOW()) 
       RETURNING id, userid, key, createdat`,
      {
        replacements: { userid: currentUserId, key: generatedKey },
        type: db.sequelize.QueryTypes.SELECT
      }
    );

    const savedData = (results && results.length > 0) 
      ? results[0] 
      : { userid: currentUserId, key: generatedKey };

    return res.status(201).json({
      message: 'API Key generated successfully',
      keyData: savedData
    });

  } catch (err) {
    console.error("Detail Error Generate Key:", err);
    return res.status(500).json({ error: err.message });
  }
};