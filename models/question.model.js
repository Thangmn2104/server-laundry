const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define questionSchema
const questionSchema = new Schema(
    {
        courseData: {
            type: {
                title: String,
                courseId: String
            },
        required: true
    },
        userId: {
            type: String, // ID người dùng
        },
        difficulty: {
            type: String,
            enum: ["Dễ", "Trung bình", "Khó"], // Chỉ cho phép ba giá trị
            required: true,
        },
        answer: {
            type: [{
                id: String,
                value: String,
                isTrue: Boolean
            }],
            required: false,
            default: []
        },
        content: {
            type: String, // Nội dung câu hỏi
            required: true,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model('Question', questionSchema);
