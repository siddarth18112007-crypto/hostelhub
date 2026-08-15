const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { SECRET_KEY } = require('../middleware/auth');

// POST /login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.get('SELECT * FROM students WHERE email = ?', [email], (err, student) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!student) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, student.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Sign JWT token
    const token = jwt.sign(
      { id: student.id, student_id: student.student_id, email: student.email, name: student.name },
      SECRET_KEY,
      { expiresIn: '7d' }
    );

    // Remove password hash from profile output
    const { password_hash, ...profile } = student;

    res.json({
      message: 'Login successful',
      token,
      profile
    });
  });
});

// POST /logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
