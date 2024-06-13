const express = require('express'); 
const router = express.Router();
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductByBarcode, getProductById } = require('../controllers/productController');


router.get('/', getAllProducts);
router.get('/:barcode', getProductByBarcode);
router.get('/search/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router; 