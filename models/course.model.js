const mongoose = require('mongoose');
const { Schema } = mongoose; 

// Define instructorSchema
const instructorSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    }
});

// Define ratingSchema
const ratingSchema = new Schema({
    value: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },
    max: {
        type: Number,
        required: true,
    }
});

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
const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    oldPrice: {
        type: String,
        required: true,
    },
    mainPrice: {
        type: String,
        required: true,
    },
    instructor: {
        type: instructorSchema, 
        required: true,
    },
    rating: {
        type: ratingSchema, 
        required: true,
    },
    videos: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    totalVideos: {
        type: Number,
        required: true,
    },
    level: {
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

module.exports = mongoose.model('Course', courseSchema);
