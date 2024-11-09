const mongoose = require('mongoose');
const { Schema } = mongoose; 


// Define courseSchema
const groupSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    courseData: {
        type: {
            title: String,
            courseId: String
        },
        required: true
    },
    teacherData: {
        type: {
            userId: String
        },  
        required: false
    },
    description: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Group', groupSchema);
