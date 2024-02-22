// src/controllers/ProductController.js

const Product = require('../models/Product');

const ProductController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getProductById: async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  createProduct: async (req, res) => {
    const { name, barcode, price, location } = req.body;
    try {
      const product = new Product({ name, barcode, price, location });
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateProduct: async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;
    try {
      const product = await Product.findByIdAndUpdate(id, updateFields, { new: true });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  deleteProduct: async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  scanOutProduct: async (req, res) => {
    const { barcode, username } = req.body;
    try {
      // Find the product by barcode
      const product = await Product.findOne({ barcode });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Update product checkout status
      product.checkedOut = true;
      product.checkedOutBy = username;
      product.checkoutCount += 1;
      await product.save();

      res.json({ message: 'Product scanned out successfully', product });
    } catch (error) {
      console.error('Error scanning out product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = ProductController;
