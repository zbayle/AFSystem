require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const productRoutes = require('./routes/productRoutes'); // Import product routes
const authMiddleware = require('./middleware/authMiddleware'); // Import auth middleware

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Middleware
app.use(express.json()); // Parse JSON bodies
// Other middleware as needed...

// Mount user routes
app.use('/api/users',function(req, res) {
  userRoutes
}); // Ensure correct path

// Mount product routes
app.use('/api/products', authMiddleware, productRoutes); // Protect product routes with auth middleware

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
