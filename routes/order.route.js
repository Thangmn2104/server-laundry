const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');

router.get('/order', OrderController.getAll);
router.post('/order', OrderController.create);
router.get('/order/:id', OrderController.getById);
router.put('/order/:id', OrderController.update);
router.delete('/order/:id', OrderController.delete);
router.put('/order/:id/status', OrderController.updateStatus);
router.get('/order/status/:status', OrderController.getByStatus);

module.exports = router; 