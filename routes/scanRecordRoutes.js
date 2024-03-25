 // scanRecordRoutes.js
const express = require('express');
const router = express.Router();
const scanRecordController = require('../controllers/scanRecordController');

router.post('/logScan', scanRecordController.logScanRecord);

module.exports = router;