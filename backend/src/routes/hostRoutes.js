const express = require('express');
const router = express.Router();
const { getHostDashboard } = require('../controllers/hostController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, getHostDashboard);

module.exports = router;
