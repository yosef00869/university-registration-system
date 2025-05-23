const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: String,
  schedule: String,
  credits: Number,
  maxStudents: Number,
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

module.exports = mongoose.model('Course', courseSchema);