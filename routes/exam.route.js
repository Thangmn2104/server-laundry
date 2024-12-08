const express = require('express');
const router = express.Router();
const ExamController = require('../controllers/exam.controller');

// Các route CRUD cho Item
router.post('/exam', ExamController.create);
router.post('/exam/create-exam', ExamController.createExamData);
router.get('/exam', ExamController.getAll);
router.get('/exam/:id', ExamController.getById);
router.put('/exam/:id', ExamController.update);
router.delete('/exam/:id', ExamController.delete);

module.exports = router;
