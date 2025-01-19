const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const multer = require('multer');

// Configure multer to use memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

router.post('/product/import', upload.single('file'), ProductController.importProducts);

router.get('/product', ProductController.getAll);
router.post('/product', ProductController.create);
router.get('/product/:id', ProductController.getById);
router.put('/product/:id', ProductController.update);
router.delete('/product/:id', ProductController.delete);
router.post('/product/removeMany', ProductController.removeMany);
router.post('/product/pin', ProductController.pin);

module.exports = router;