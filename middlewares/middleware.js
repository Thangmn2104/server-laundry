const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const middleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Access Denied: No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: Malformed token.' });
    }

    try {
        const secretKey = process.env.JWT_SECRET || 'your-secret-key';

        const decoded = jwt.decode(token, secretKey);

        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Access Denied: Invalid token.' });
        }

        req.user = user;

        next();

    } catch (error) {
        return res.status(403).json({ message: 'Invalid token.' });
    }
};

module.exports = middleware;
