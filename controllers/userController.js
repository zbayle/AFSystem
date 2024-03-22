const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Controller function to handle user registration
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

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
      role
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

    // Find the user by username
    const user = await User.findOne({ username });

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

module.exports = { registerUser, loginUser, getUserProfile };
