const express = require('express');
const router = express.Router();
const ChapterController = require('../controllers/chapter.controller');

// Các route CRUD cho Item
router.post('/chapter', ChapterController.create);
router.get('/chapter', ChapterController.getAll);
router.get('/chapter/:id', ChapterController.getById);
router.put('/chapter/:id', ChapterController.update);
router.delete('/chapter/:id', ChapterController.delete);

module.exports = router;
