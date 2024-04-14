const express = require('express'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const emailRoutes = require('./routes/emailRoutes');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const PermsRoutes = require('./routes/PermsRoutes');
const scanRecord = require('./routes/scanRecordRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/perms', PermsRoutes);
app.use('/api/', scanRecord);
app.use('/api/emails', emailRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
