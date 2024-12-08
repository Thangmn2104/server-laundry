const mongoose = require('mongoose');
const { questionSchema } = require('./question.model');
const { Schema } = mongoose;

// Define courseData schema
const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
});

// Define groupData schema
const groupSchema = new Schema({
  groupId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

// Main schema
const examSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dateStart: {
      type: Date,
      required: true,
    },
    time: {
      type: Number, // Assuming "time" is in hours or minutes as a number
      required: true,
    },
    dateEnd: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    isViewPointAfterExam: {
      type: Boolean,
      required: true,
    },
    isViewTestAfterExam: {
      type: Boolean,
      required: true,
    },
    courseData: {
      type: courseSchema,
      required: true,
    },
    groupData: {
      type: groupSchema,
      required: true,
    },
    status: {
      type: Number,
      required: true,
      enum: [0, 1], // Assuming 0 or 1 for status
    },
    studentId: {
      type: String,
      required: false,
      default: ""
    },
    userId: {
      type: String,
      required: false,
    },
    examData: {
      type: [questionSchema],
      required: true
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Exam', examSchema);
