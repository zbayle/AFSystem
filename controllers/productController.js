const Product = require('../models/Product');

// Controller function to handle retrieving all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to handle creating a new product
const createProduct = async (req, res) => {
  try {
    // Extract fields from request body
    const { name, description, price } = req.body;

    // Validate request body
    if (!name || !description || !price) {
      return res.status(400).json({ message: 'Name, description, and price are required' });
    }

    // Create new product instance
    const newProduct = new Product({ name, description, price });

    // Save new product to database
    await newProduct.save();

    // Return success response
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to handle updating a product
const updateProduct = async (req, res) => {
  try {
    // Extract product ID from request parameters
    const { id } = req.params;

    // Extract fields to update from request body
    const { name, description, price } = req.body;

    // Update product in the database
    const updatedProduct = await Product.findByIdAndUpdate(id, { name, description, price }, { new: true });

    // Return success response
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to handle deleting a product
const deleteProduct = async (req, res) => {
  try {
    // Extract product ID from request parameters
    const { id } = req.params;

    // Delete product from the database
    await Product.findByIdAndDelete(id);

    // Return success response
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAllProducts, createProduct, updateProduct, deleteProduct };
