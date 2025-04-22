// routes/lineRoutes.js
const express = require('express');
const router = express.Router();
const lineController = require('../controllers/lineController');

// เส้นทางสำหรับ webhook ของ LINE
router.post('/callback', lineController.handleWebhook);

module.exports = router;
