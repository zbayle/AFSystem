// scanRecordController.js
const ScanRecord = require('../models/scanLog.model');

const logScanRecord = async (req, res) => {
  const { productId, techId } = req.body;

  // Validate input data
  if (!productId || !techId) {
    return res.status(400).json({ error: 'Missing product ID or tech ID' });
  }

  // Create new record in database
  const scanRecord = new ScanRecord({ productId, techId });

  try {
    await scanRecord.save();
    // Send response to client
    res.json(scanRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while saving the scan record' });
  }
};

module.exports = {
    logScanRecord,
};