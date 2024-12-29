const express = require('express');
const router = express.Router();
const MediaController = require('../controllers/media.controller');

// Các route CRUD cho Item
router.post('/media/upload', MediaController.uploadFiles)
router.post('/media/upload-document', MediaController.uploadDocument)
router.post('/media/upload-video', MediaController.uploadVideo)


module.exports = router;