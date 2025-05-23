const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

const checkAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can add courses' });
  }
  next();
};

router.get('/courses', authenticateToken, async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses: ' + error.message });
  }
});

router.post('/courses', authenticateToken, checkAdmin, async (req, res) => {
  const { name, schedule, credits, maxStudents, prerequisites } = req.body;
  if (!name || !schedule || !credits || !maxStudents) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const course = new Course({ name, schedule, credits, maxStudents, prerequisites: prerequisites || [] });
  try {
    await course.save();
    res.status(201).json({ message: 'Course added' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding course: ' + error.message });
  }
});

router.post('/register-course', authenticateToken, async (req, res) => {
  const { studentId, courseId } = req.body;
  try {
    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) {
      return res.status(404).json({ message: 'Student or course not found' });
    }

    if (student.registeredCourses.includes(courseId)) {
      return res.status(400).json({ message: 'Already registered for this course' });
    }

    const enrolledStudents = await Student.countDocuments({ registeredCourses: courseId });
    if (enrolledStudents >= course.maxStudents) {
      return res.status(400).json({ message: 'Course is full' });
    }

    student.registeredCourses.push(courseId);
    student.totalCredits += course.credits;
    await student.save();

    res.status(200).json({ message: 'Course registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering course: ' + error.message });
  }
});

router.get('/student/:id', authenticateToken, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('registeredCourses');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student: ' + error.message });
  }
});

module.exports = router;