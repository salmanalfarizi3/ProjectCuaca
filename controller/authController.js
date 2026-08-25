const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token tidak ditemukan' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'mysupersecretkey123', (err, decodedPayload) => {
    if (err) {
      return res.status(403).json({ error: 'Token tidak valid atau kedaluwarsa' });
    }

    // Memasang payload user secara lengkap & fallback ke ID 1 jika simulasi
    req.user = {
      id: decodedPayload.id || decodedPayload.userId || 1,
      userId: decodedPayload.userId || decodedPayload.id || 1,
      username: decodedPayload.username,
      email: decodedPayload.email
    };

    next();
  });
};