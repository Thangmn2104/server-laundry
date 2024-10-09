// courseSchema.js
const mongoose = require('mongoose');
const { Schema } = mongoose; // Sử dụng Schema từ mongoose

// Định nghĩa instructorSchema
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

// Định nghĩa ratingSchema
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

// Định nghĩa courseSchema
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
        type: instructorSchema, // Sử dụng instructorSchema
        required: true,
    },
    rating: {
        type: ratingSchema, // Sử dụng ratingSchema
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
});

module.exports = mongoose.model('Course', courseSchema);
