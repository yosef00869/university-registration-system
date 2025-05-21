const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const student = new Student({ name, email, password: hashedPassword });
  await student.save();
  res.status(201).json({ message: 'Student registered' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const student = await Student.findOne({ email });
  if (!student || !(await bcrypt.compare(password, student.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: student._id }, 'your_jwt_secret');
  res.json({ token });
});

module.exports = router;