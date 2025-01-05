const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const productRoutes = require('./routes/product.route');
const orderRoutes = require('./routes/order.route');
const dashboardRoutes = require('./routes/dashboard.route');
const authRoutes = require('./routes/auth.route');

const app = express();
const port = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS configuration
app.use(cors({
    origin: ['https://laundry-j5vy.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'access-control-allow-origin'],
    exposedHeaders: ['access-control-allow-origin'],
    credentials: true
}));

// Add OPTIONS handling for preflight requests
app.options('*', cors());

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Routes
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something broke!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // Don't exit the process in development
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
});

module.exports = app;

