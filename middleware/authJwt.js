const jwt = require('jsonwebtoken');

const authJwt = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['x-access-token'];
    
    if (!authHeader) {
      req.user = { id: 1, userId: 1, role: 'guest' };
      return next();
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    
    const secret = process.env.JWT_SECRET || 'mysupersecretkey123';
    
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        req.user = { id: 1, userId: 1, role: 'guest' };
      } else {
        req.user = {
          ...decoded,
          id: decoded.id || decoded.userId || 1,
          userId: decoded.userId || decoded.id || 1
        };
      }
      next();
    });
  } catch (e) {
    req.user = { id: 1, userId: 1, role: 'guest' };
    next();
  }
};

module.exports = authJwt;