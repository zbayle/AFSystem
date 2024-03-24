const mongoose = require('mongoose'); 

const permissionSchema = new mongoose.Schema({
  createUser: {
    type: Boolean,
    default: false
  },
  createProduct: {
    type: Boolean,
    default: false
  },
  deleteUser: {
    type: Boolean,
    default: false
  },
  deleteProduct: {
    type: Boolean,
    default: false
  },
  weight: {
    type: Number,
    default: 0
  }
});

const roleSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    unique: true
  },
  perms: [permissionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Role', roleSchema);