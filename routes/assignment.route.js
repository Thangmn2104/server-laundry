const express = require('express');
const router = express.Router();
const AssignmentController = require('../controllers/assignment.controller');

// Các route CRUD cho Item
router.post('/assignment', AssignmentController.create);
router.get('/assignment', AssignmentController.getAll);
router.get('/assignment/:id', AssignmentController.getById);
router.put('/assignment/:id', AssignmentController.update);
router.delete('/assignment/:id', AssignmentController.delete);

module.exports = router;
