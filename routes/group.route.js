const express = require('express');
const router = express.Router();
const GroupController = require('../controllers/group.controller');

// Các route CRUD cho Item
router.post('/group', GroupController.create);
router.get('/group', GroupController.getAll);
router.get('/group/:id', GroupController.getById);
router.put('/group/:id', GroupController.update);
router.delete('/group/:id', GroupController.delete);

module.exports = router;
