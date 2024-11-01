const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const middleware = require('../middlewares/middleware')

// Các route CRUD cho Item
router.get('/user/me', middleware, UserController.me);

router.post('/user', UserController.create);
router.get('/user', UserController.getAll);
router.get('/user/:id', UserController.getById);
router.put('/user/:id', UserController.update);
router.delete('/user/:id', UserController.delete);
router.post('/user/register', UserController.register);
router.post('/user/login', UserController.login);
router.post('/user/forget-password', UserController.forgetPassword);
router.post('/user/reset-passoword', UserController.resetPassword);
router.post('/user/sign-course', middleware, UserController.signCourse);
router.post('/user/complete-registeration', middleware, UserController.completeRegisteratiom);

module.exports = router;
