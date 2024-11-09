
const mongoose = require('mongoose');
const { Schema } = mongoose; 

// / Define lessonSchema with _id enabled
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

const chapterSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    groupId: {
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

module.exports = mongoose.model('Chapter', chapterSchema);