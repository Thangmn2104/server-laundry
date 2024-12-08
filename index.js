const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
const User = require('./models/user.model')
const bcrypt = require('bcrypt')
require('dotenv').config();

const courseRoutes = require('./routes/course.route');
const assignmentRoutes = require('./routes/assignment.route');
const userRoutes = require('./routes/user.route');
const mediaRoutes = require('./routes/media.route');
const groupRoutes = require('./routes/group.route');
const chapterRoutes = require('./routes/chapter.route');
const questionRotes = require('./routes/question.route');
const examRoutes = require('./routes/exam.route');
const xlsx = require('xlsx');

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

app.post('/api/import-users', async (req, res) => {
  try {
    const workbook = xlsx.readFile('./student_data.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const usersData = xlsx.utils.sheet_to_json(worksheet);

    for (const userData of usersData) {
      const { email, ID, password, userName, role } = userData;

      // Kiểm tra xem email đã tồn tại chưa
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log(`User with email ${email} already exists. Skipping.`);
        continue; // Bỏ qua người dùng này
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
    }

    res.status(201).json({ message: 'Users imported successfully' });
  } catch (error) {
    console.error('Error importing users:', error);
    res.status(500).json({ error: 'Failed to import users' });
  }
});


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
