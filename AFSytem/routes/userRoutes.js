const express = require('express'); 
const router = express.Router();
const { registerUser, loginUser,fobLogin, getUserProfile, getAllUserProfiles, getUserProfileById, changePassword } = require('../controllers/userController');
const authenticateUser = require('../middlewares/authMiddleware');

// Define routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/foblogin', fobLogin);
router.get('/profile', authenticateUser, getUserProfile); // Apply authentication middleware to the /profile route
router.get('/profile/allUsers', authenticateUser, getAllUserProfiles); // Apply authentication middleware to the /profile/allUsers route
router.get('/profile/:id', authenticateUser, getUserProfileById); // Apply authentication middleware
router.post('/changePassword', authenticateUser,changePassword); // Apply authentication middleware

module.exports = router;
