const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answer.controller');

// Các route CRUD cho Item
router.post('/answer', answerController.create);
router.get('/answer', answerController.getAll);
router.get('/answer/:id', answerController.getById);
router.put('/answer/:id', answerController.update);
router.delete('/answer/:id', answerController.delete);

module.exports = router;
