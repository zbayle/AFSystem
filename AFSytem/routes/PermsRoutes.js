const express = require('express'); 
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Role = require('../models/perms.model');
const { getPerms } = require('../controllers/PermsController');

const router = express.Router();

// Middleware function to authenticate user
async function authenticateUser(req, res, next) {
    try {
        // Check if the Authorization header is present
        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'No Authorization header present' });
        }

        // Get the token from the Authorization header
        const token = req.headers.authorization.split(' ')[1];

        // Check if the token is present
        if (!token) {
            return res.status(401).json({ message: 'No token present in Authorization header' });
        }

        let decoded;
        try {
            // Verify the token
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: 'Token verification failed', error: err.message });
        }

        // Get the user from the database
        const user = await User.findById(decoded.userId);

        // If the user doesn't exist, send a 401 response
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Attach the user's role to the req object
        req.user = {
            role: user.role
        };

        next();
    } catch (err) {
        // If any other error occurred, send a 500 response
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Route for getting the permissions of the logged in user
router.get('/getPerms', authenticateUser, async (req, res, next) => {
    const role = req.user.role; // Extract role from req.user

    // Find the role in the database
    const roleData = await Role.findOne({ role: role });

    if (!roleData) {
        return res.status(404).json({ message: 'Role not found' });
    }

    res.json({
        role: roleData.role,
        perms: roleData.perms
    }
    );


});

module.exports = router;