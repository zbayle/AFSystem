const Product = require('../models/product.model'); 

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

//Controller function to handle retrieving a product by barcode
const getProductByBarcode = async (req, res) => {
  try {
    if (!req.params.barcode) {
      return res.status(400).json({ message: 'No barcode provided' });
    }

    const product = await Product.findOne({ upc: req.params.barcode });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error retrieving product:', error);
    if (error instanceof mongoose.Error.CastError && error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid barcode format' });
    }
    res.status(500).json({ message: error.message });
  }
};


//Controller function to handle retrieving a product by id
const getProductById = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'No product ID provided' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error retrieving product:', error);
    if (error instanceof mongoose.Error.CastError && error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    res.status(500).json({ message: error.message });
  }
};


// Controller function to handle creating a new product
const createProduct = async (req, res) => { 
  try {
    // Extract fields from request body
    const { displayName, shortName, cost, unitsOnHand, upc } = req.body;

    // Validate request body
    if (!displayName || !shortName || !cost || !unitsOnHand || !upc) {
      return res.status(400).json({ message: 'displayName, shortName, cost, and unitsOnHand are required' });
    }

    // Create new product instance
    const newProduct = new Product({ displayName, shortName, cost, unitsOnHand, upc });

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
  console.log('updateProduct called with id:', req.params.id);
  console.log('Request body:', req.body);

  try {
    // Find product by id and update it
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body, // This contains the fields to be updated
      { new: true } // This option returns the updated document
    );

    if (!updatedProduct) {
      console.log('Product not found:', req.params.id);
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log('Product updated successfully:', updatedProduct);

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
    // Delete the product from the database
    const product = await Product.findByIdAndDelete(req.params.id);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Return success response
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { 
  getAllProducts,
  getProductByBarcode,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
};