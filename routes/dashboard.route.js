const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboard.controller');
const middleware = require('../middlewares/middleware');

router.get('/dashboard', middleware, DashboardController.getDashboardStats);

module.exports = router; 