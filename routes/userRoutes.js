const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const authenticateUser = require('../middlewares/authMiddleware');

// Define routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticateUser, getUserProfile); // Apply authentication middleware to the /profile route

module.exports = router;
