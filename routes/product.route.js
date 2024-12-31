const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');

router.get('/product', ProductController.getAll);
router.post('/product', ProductController.create);
router.get('/product/:id', ProductController.getById);
router.put('/product/:id', ProductController.update);
router.delete('/product/:id', ProductController.delete);

module.exports = router;