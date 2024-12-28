const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config();

const courseRoutes = require('./routes/course.route');
const assignmentRoutes = require('./routes/assignment.route');
const userRoutes = require('./routes/user.route');
const mediaRoutes = require('./routes/media.route');
const groupRoutes = require('./routes/group.route');
const chapterRoutes = require('./routes/chapter.route');
const questionRotes = require('./routes/question.route');
const examRoutes = require('./routes/exam.route');
const notificationRoutes = require('./routes/notification.route');
const answerRoutes = require('./routes/answer.route');
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
app.use('/api', groupRoutes);
app.use('/api', chapterRoutes);
app.use('/api', questionRotes);
app.use('/api', examRoutes);
app.use('/api', notificationRoutes);
app.use('/api', answerRoutes);

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch((err) => {
    console.error('MongoDB connection error:', err.message);
});
