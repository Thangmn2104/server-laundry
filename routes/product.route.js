const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const multer = require('multer');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

router.post('/product/import', upload.single('file'), ProductController.importProducts);

router.get('/product', ProductController.getAll);
router.post('/product', ProductController.create);
router.get('/product/:id', ProductController.getById);
router.put('/product/:id', ProductController.update);
router.delete('/product/:id', ProductController.delete);
router.post('/product/removeMany', ProductController.removeMany);

module.exports = router;