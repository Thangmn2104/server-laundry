const BaseController = require('./base.controller');
const UserService = require('../services/user.service');

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

    signCourse = async (req, res) => {
        try {
            const { courseId, _id } = req.body;

            if (!courseId || !_id) {
                return res.status(400).json({ message: 'Error: Missing information' });
            }
            const result = await UserService.signCourse({ _id, courseId });

            return res.status(200).json(result);

        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    };

}

module.exports = new UserController();
