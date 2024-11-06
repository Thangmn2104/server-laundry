const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/course.controller');

// Các route CRUD cho Item
router.post('/course', CourseController.create);
router.get('/course', CourseController.getAll);
router.get('/course/export', CourseController.exportUserCSV);
router.get('/course/:id', CourseController.getById);
router.put('/course/:id', CourseController.update);
router.delete('/course/:id', CourseController.delete);

module.exports = router;
