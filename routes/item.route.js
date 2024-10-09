const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');

// Các route CRUD cho Item
router.post('/items', itemController.create);
router.get('/items', itemController.getAll);
router.get('/items/:id', itemController.getById);
router.put('/items/:id', itemController.update);
router.delete('/items/:id', itemController.delete);

module.exports = router;
