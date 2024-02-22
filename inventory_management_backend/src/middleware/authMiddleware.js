// src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function authMiddleware(req, res, next) {
  // Get token from headers
  const token = req.headers.authorization;

  // Check if token exists
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token is required.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Access denied. User not found.' });
    }

    // Attach user object to request for further use
    req.user = user;

    // Proceed to next middleware or route handler
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Access denied. Invalid token.' });
  }
}

module.exports = authMiddleware;
