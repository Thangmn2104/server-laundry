const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config();

const productRoutes = require('./routes/product.route');
const orderRoutes = require('./routes/order.route');
const dashboardRoutes = require('./routes/dashboard.route');
const authRoutes = require('./routes/auth.route');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors())

// Routes
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', authRoutes);

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch((err) => {
    console.error('MongoDB connection error:', err.message);
});

// Thêm dòng này để export app
module.exports = app;

