const jwt = require('jsonwebtoken');

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

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(403).json({ message: 'Invalid token.' });
    }
};

module.exports = middleware;
