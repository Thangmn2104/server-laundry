const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const middleware = require('../middlewares/middleware')

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đảm bảo thư mục uploads tồn tại
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Cấu hình storage cho multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Thư mục lưu file
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Cấu hình file filter
const fileFilter = (req, file, cb) => {
    // Kiểm tra mime type của file
    if (
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || // .xlsx
        file.mimetype === 'application/vnd.ms-excel' || // .xls
        file.mimetype === 'text/csv' // .csv
    ) {
        cb(null, true);
    } else {
        cb(new Error('Only Excel files are allowed!'), false);
    }
};

// Cấu hình multer
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Giới hạn 5MB
});

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
