const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');

// Các route CRUD cho Notification
router.post('/notification', notificationController.create);
router.get('/notification', notificationController.getAll);
router.get('/notification/:id', notificationController.getById);
router.put('/notification/:id', notificationController.update);
router.delete('/notification/:id', notificationController.delete);

module.exports = router;
