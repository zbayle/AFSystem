// src/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

// Define routes for CRUD operations on products
router.get('/products', ProductController.getAllProducts);
router.get('/products/:id', ProductController.getProductById);
router.post('/products', ProductController.createProduct);
router.put('/products/:id', ProductController.updateProduct);
router.delete('/products/:id', ProductController.deleteProduct);
router.post('/scan-out', (req, res) => {
    console.log('Received POST request to /scan-out');
    res.send('Received POST request to /scan-out');
  });

module.exports = router;
