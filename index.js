const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config();

const courseRoutes = require('./routes/course.route');
const assignmentRoutes = require('./routes/assignment.route');
const userRoutes = require('./routes/user.route');
const mediaRoutes = require('./routes/media.route');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors())

// Routes
app.use('/api', courseRoutes);
app.use('/api', assignmentRoutes);
app.use('/api', userRoutes);
app.use('/api', mediaRoutes);

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch((err) => {
    console.error('MongoDB connection error:', err.message);
});
