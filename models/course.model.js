const mongoose = require('mongoose');
const { Schema } = mongoose; 

// Define courseSchema
const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    courseId: {
        type: String,
        required: true,
    },
    groupIds: {
        type: [String],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Course', courseSchema);




