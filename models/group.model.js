const mongoose = require('mongoose');
const { Schema } = mongoose; 

// Define lessonSchema with _id enabled
const lessonSchema = new Schema({
    duration: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
}, {
    _id: true, // Enable _id for lessons
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Define chapterSchema with _id enabled
const chapterSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: false
    },
    lessons: {
        type: [lessonSchema],
        required: false
    },
}, {
    _id: true, // Enable _id for chapters
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Define courseSchema
const groupSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    teacherId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    chapters: {
        type: [chapterSchema],
        required: false
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Group', groupSchema);
