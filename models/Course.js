const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: String,
  schedule: String,
  credits: Number,
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  maxStudents: Number,
});

module.exports = mongoose.model('Course', courseSchema);