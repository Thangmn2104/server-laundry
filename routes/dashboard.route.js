const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboard.controller');

router.get('/dashboard', DashboardController.getDashboardStats);

module.exports = router; 