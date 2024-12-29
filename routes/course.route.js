const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/course.controller');
const multer = require('multer');
const upload = multer();

// Các route CRUD cho Item
router.post('/course', CourseController.create);
router.post('/course/import', upload.single('file'), CourseController.importCourse);
router.post('/course/delete-many', CourseController.deleteMany);
router.get('/course', CourseController.getAll);
router.get('/course/export', CourseController.exportUserCSV);
router.get('/course/:id', CourseController.getById);
router.put('/course/:id', CourseController.update);
router.delete('/course/:id', CourseController.delete);

module.exports = router;
