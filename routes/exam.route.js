const express = require('express');
const router = express.Router();
const ExamController = require('../controllers/exam.controller');

// Các route CRUD cho Item
router.post('/exam', ExamController.create);
router.post('/exam/create-exam', ExamController.createExamData);
router.post('/exam/create-student-exam', ExamController.createStudentExamData);
router.get('/exam', ExamController.getAllExam);
router.get('/exam/:id', ExamController.getById);
router.put('/exam/update-student-exam/:id', ExamController.updateStudentExamData);
router.delete('/exam/:id', ExamController.delete);

module.exports = router;
