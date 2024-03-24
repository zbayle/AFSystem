const mongoose = require('mongoose'); 

const productSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true
  },
  shortName: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  unitsOnHand: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Products', productSchema);
