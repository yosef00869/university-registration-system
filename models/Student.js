const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  registeredCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  totalCredits: { type: Number, default: 0 },
});

module.exports = mongoose.model('Student', studentSchema);