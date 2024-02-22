// src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Define routes for user authentication
router.post('/login', AuthController.login);

module.exports = router;
