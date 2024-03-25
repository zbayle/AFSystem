const express = require('express'); 
const router = express.Router();
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductByBarcode } = require('../controllers/productController');

// Define routes
router.get('/', getAllProducts);
router.get('/:barcode', getProductByBarcode);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router; 