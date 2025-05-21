const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // مسار لموديل الطالب
const Course = require('../models/Course');   // مسار لموديل الكورس

router.post('/register-course', async (req, res) => {
  const { studentId, courseId } = req.body;
  const student = await Student.findById(studentId).populate('registeredCourses');
  const course = await Course.findById(courseId);

  // Check credits
  if (student.totalCredits + course.credits > 18) {
    return res.status(400).json({ message: 'Credit limit exceeded' });
  }

  // Check schedule conflict
  const conflict = student.registeredCourses.some(
    (c) => c.schedule === course.schedule
  );
  if (conflict) {
    return res.status(400).json({ message: 'Schedule conflict' });
  }

  // Check prerequisites (simplified)
  if (course.prerequisites.length > 0) {
    const hasPrereq = student.registeredCourses.some((c) =>
      course.prerequisites.includes(c._id)
    );
    if (!hasPrereq) {
      return res.status(400).json({ message: 'Prerequisites not met' });
    }
  }

  student.registeredCourses.push(courseId);
  student.totalCredits += course.credits;
  await student.save();
  res.json({ message: 'Course registered successfully' });
});

module.exports = router;