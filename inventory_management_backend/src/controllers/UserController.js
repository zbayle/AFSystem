// src/controllers/UserController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');

const UserController = {
  // Other controller functions...

  createUser: async (req, res) => {
    const { username, password, role } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword, role });
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update other user controller functions as needed
};

module.exports = UserController;
