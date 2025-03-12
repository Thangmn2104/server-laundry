const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const middleware = require('../middlewares/middleware');

router.get('/order', middleware, OrderController.getAllOrders);
router.post('/order', middleware, OrderController.createOrder);
router.get('/order/:id', middleware, OrderController.getById);
router.put('/order/:id', middleware, OrderController.update);
router.delete('/order/:id', middleware, OrderController.delete);
router.put('/order/:id/status', middleware, OrderController.updateStatus);
router.get('/order/status/:status', middleware, OrderController.getByStatus);

module.exports = router; 