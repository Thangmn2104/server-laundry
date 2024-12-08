const mongoose = require('mongoose');

const { Schema } = mongoose;

// Schema cho từng phần tử trong mảng `data`
const DataSchema = new Schema({
  answerId: {
    type: String,
    required: true,
  },
  correctId: {
    type: String,
    required: true,
  },
});

// Schema chính
const AnswerSchema = new Schema({
  examId: {
    type: String,
    required: true,
  },
  data: {
    type: [DataSchema],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('answer', AnswerSchema);
