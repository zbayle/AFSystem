// src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware

// User registration route
router.post('/register', function(req, res) { 
    UserController.createUser
}); // Use createUser function

// User login route
router.post('/login',function(req, res) { 
    UserController.login
});

// User profile route (protected)
router.get('/profile', authMiddleware,function(req, res) {
    UserController.profile
});

module.exports = router;
