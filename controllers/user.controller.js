const BaseController = require('./base.controller');
const UserService = require('../services/user.service');
const xlsx = require('xlsx');
const User = require('../models/user.model')
const fs = require('fs');


class UserController extends BaseController {
    constructor() {
        super(UserService);  // Kế thừa từ BaseController và truyền service của Item
    }

    register = async (req, res) => {
        try {
            const data = await UserService.register(req.body);
            res.status(201).json(data);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    completeRegisteratiom = async (req, res) => {
        try {
            const {_id, data} = req.body
            const newUserData = await UserService.completeRegisteratiom(_id, data);
            console.log('log ra:', newUserData)
            res.status(200).json(newUserData);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await UserService.login(email, password);
            res.json(result);
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }

    me = async (req, res) => {
        try {
            const { email } = req.user;

            const result = await UserService.me(email);

            res.json(result);

        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }

    forgetPassword = async (req, res) => {
        try {
            const { email } = req.body;
            const result = await UserService.forgetPassword(email);
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    resetPassword = async (req, res) => {
        try {
            const { token, newPassword } = req.body;
            const result = await UserService.resetPassword(token, newPassword);
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    importUsers = async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const usersData = xlsx.utils.sheet_to_json(worksheet);

            for (const userData of usersData) {
                const { email, ID, password, userName, role } = userData;

                // Kiểm tra xem email đã tồn tại chưa
                const existingUser = await User.findOne({ email });

                if (existingUser) {
                    console.log(`User with email ${email} already exists. Skipping.`);
                    continue;
                }

                // Tạo người dùng mới
                const newUser = new User({
                    email,
                    ID,
                    password,
                    userName,
                    role,
                });

                await newUser.save();
                console.log(`User with email ${email} imported successfully.`);
            }

            res.status(201).json({ message: 'Users imported successfully' });
        } catch (error) {
            console.error('Error importing users:', error);
            res.status(500).json({ error: 'Failed to import users' });
        }
    }

    signCourse = async (req, res) => {
        try {
            const { courseId, ids } = req.body;

            if (!courseId || !ids ) {
                return res.status(400).json({ message: 'Error: Missing information' });
            }
            const result = await UserService.signCourse({ ids, courseId });

            return res.status(200).json(result);

        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    };

}

module.exports = new UserController();
