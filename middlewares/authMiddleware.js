// authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authenticateUser = async (req, res, next) => {
  try {
    // Extract JWT token from request headers
    const token = req.headers.authorization.split(' ')[1]; // Assuming token is in format "Bearer token"

    // Verify JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Extract user ID from decoded token
    const userId = decodedToken.userId;

    // Fetch user from database using user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user object to request
    req.user = user;

    // Proceed to next middleware or route handler
    next();
  } catch (error) {
    console.error('Error authenticating user:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authenticateUser;
