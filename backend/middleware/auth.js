const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Get Authorization header (Bearer <token>)
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No authorization token provided.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Malformed token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = decoded; // Attach user info (userId, email) to req
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;