const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/product.route');
const orderRoutes = require('./routes/order.route');
const dashboardRoutes = require('./routes/dashboard.route');
const authRoutes = require('./routes/auth.route');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
app.use(cors());

// Add preflight handler for all routes
app.options('*', (req, res) => {
    res.status(200).end();
});

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

// MongoDB connection with improved error handling and options
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    family: 4 // Use IPv4, skip trying IPv6
})
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server running on port ${port}`);
    });
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Add connection error handler
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    // Attempt to reconnect
    mongoose.connect(process.env.MONGO_URI).catch(() => {
        console.error('Failed to reconnect to MongoDB');
    });
});

// Add disconnection handler
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
    mongoose.connect(process.env.MONGO_URI).catch(() => {
        console.error('Failed to reconnect to MongoDB');
    });
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

