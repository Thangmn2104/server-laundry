const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/product', ProductController.getAll);
router.post('/product', ProductController.create);
router.get('/product/:id', ProductController.getById);
router.put('/product/:id', ProductController.update);
router.delete('/product/:id', ProductController.delete);
router.post('/product/removeMany', ProductController.removeMany);
router.post('/product/import', upload.single('file'), ProductController.importProducts);

module.exports = router;