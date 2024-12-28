const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const middleware = require('../middlewares/middleware')

const multer = require('multer');

// Cấu hình multer đơn giản nhất
const upload = multer();

// Các route CRUD cho Item
router.get('/auth/me', middleware, UserController.me);

router.post('/user',middleware, UserController.create);
router.get('/user', middleware, UserController.getAll);
router.get('/user/:id', middleware,UserController.getById);
router.put('/user/:id', middleware, UserController.update);
router.delete('/auth/:id', middleware, UserController.delete);
router.post('/auth/register', UserController.register);
router.post('/auth/login', UserController.login);
router.post('/auth/forget-password', UserController.forgetPassword);
router.post('/auth/reset-passoword', UserController.resetPassword);
router.post('/user/sign-course', middleware, UserController.signCourse);
router.post('/user/import-users', upload.single('file'), UserController.importUsers);
// router.post('/auth/complete-registeration', middleware, UserController.completeRegisteratiom);

module.exports = router;
