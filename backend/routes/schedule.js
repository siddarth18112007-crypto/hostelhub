const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

// GET /schedule - Get schedule items for student
router.get('/schedule', authMiddleware, (req, res) => {
  const studentId = req.user.student_id;
  const { period, filter } = req.query; // period: today, tomorrow, this_week. filter: All, Mess, Laundry, Repair, Events

  let query = 'SELECT time, endTime, title, category, location, type, status, day FROM schedule_items WHERE student_id = ?';
  const params = [studentId];

  // Apply day/period filter
  if (period === 'today') {
    query += ' AND day = "today"';
  } else if (period === 'tomorrow') {
    query += ' AND day = "tomorrow"';
  } // 'this_week' gets all today + tomorrow items in this mock environment

  // Apply category filter
  if (filter && filter !== 'All') {
    query += ' AND type = ?';
    params.push(filter.toLowerCase());
  }

  query += ' ORDER BY id ASC';

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

module.exports = router;
