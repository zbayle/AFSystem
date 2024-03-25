// scanLog.model.js
const mongoose = require('mongoose');

const ScanRecordSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  techId: {
    type: String,
    required: true,
  },
  scanTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ScanRecord', ScanRecordSchema);