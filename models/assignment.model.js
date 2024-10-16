// courseSchema.js
const mongoose = require('mongoose');
const { Schema } = mongoose; // Sử dụng Schema từ mongoose


const fileSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: false,
    },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const sectionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    files: {
        type: [fileSchema],
        required: false
    }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});



const assignmentSchema = new Schema({
    courseId: {
        type: String,
        required: true
    },
    author:{
        name: String,
        image: String,
        authorId: String
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    sections: {
        type: [sectionSchema],
        require: false
    }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('assignment', assignmentSchema);
