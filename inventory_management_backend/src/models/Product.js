// src/models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  barcode: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  checkedOut: {
    type: Boolean,
    default: false,
  },
  checkedOutBy: {
    type: String,
    default: '',
  },
  checkoutCount: {
    type: Number,
    default: 0,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
