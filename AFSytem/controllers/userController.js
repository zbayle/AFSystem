const User = require('../models/user.model');  
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Controller function to handle user registration
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, fob } = req.body;

    // Check if the user already exists
    let existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      fob
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to handle user login
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    let user; // Define user here

    // Find the user by username
    try {
      user = await User.findOne({ username });
    } catch (error) {
      // Handle error if needed
    }

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token in the response
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


//User FOB login
const fobLogin = async (req, res) => {
  const { fob } = req.body;

  try {
    const user = await User.findOne({ fob });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token, userId: user._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




// Controller function to handle retrieving user profile
const getUserProfile = async (req, res) => {
  try {
    // Extract user ID from the request (assuming it's included in the JWT token)
    const userId = req.user;
    console.log(JSON.stringify(userId));

    // Query the database to find the user's profile using the user ID
    const userProfile = await User.findById(userId);

    // Check if the user profile exists
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Return the user profile in the response
    res.status(200).json({ userProfile });
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to get user profile by ID
const getUserProfileById = async (req, res) => {
  try {
    const userId = req.params.id;
    const userProfile = await User.findById(userId);
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    res.status(200).json({ userProfile });
  } catch (error) {
    console.error('Error retrieving user profile by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Controller function to get all user profiles
const getAllUserProfiles = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profiles' });
  }
};

// Service function to fetch all users
const fetchAllUsers = async () => {
  try {
    const users = await User.find({});
    return users;
  } catch (error) {
    console.error('Error fetching user profiles', error);
    return [];
  }
};

// Controller function to change a user's password
const changePassword = async (req, res) => {
  try {
    // Allow admin to change any user's password or default to the logged-in user
    const userId = req.body.userId || req.user._id;
    const { newPassword } = req.body;

    // Optional: Check if the requester is an admin or the same user to prevent unauthorized changes
    if (req.user.role !== 'admin' && req.user._id !== userId) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password successfully changed' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { registerUser, loginUser,fobLogin, getUserProfile, getAllUserProfiles,getUserProfileById, fetchAllUsers, changePassword };
