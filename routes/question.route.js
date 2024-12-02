const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');

// Các route CRUD cho Item
router.post('/question', questionController.create);
router.get('/question', questionController.getAll);
router.get('/question/:id', questionController.getById);
router.put('/question/:id', questionController.update);
router.delete('/question/:id', questionController.delete);

module.exports = router;
