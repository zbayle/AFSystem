// src/controllers/AuthController.js

const User = require('../models/User');
const { generateToken } = require('../utils/authUtils');
const bcrypt = require('bcrypt');

const AuthController = {
  login: async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const token = generateToken(user);
      res.json({ token });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = AuthController;
