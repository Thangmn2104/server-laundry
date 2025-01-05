const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

class AuthService {
    async login(username, password) {
        // Tìm user theo username
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('User not found');
        }

        // Kiểm tra password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }

        // Tạo JWT token
        const token = jwt.sign(
            { 
                userId: user._id,
                username: user.username,
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        };
    }

    async register(userData) {
        // Kiểm tra user đã tồn tại
        const existingUser = await User.findOne({
            $or: [
                { username: userData.username },
                { email: userData.email }
            ]
        });

        if (existingUser) {
            throw new Error('Username or email already exists');
        }

        // Tạo user mới
        const user = new User(userData);
        await user.save();

        return {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };
    }
}

module.exports = new AuthService();
