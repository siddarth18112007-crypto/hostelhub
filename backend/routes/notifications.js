const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

// GET /alerts - Get list of alerts for the user
router.get('/alerts', authMiddleware, (req, res) => {
  const studentId = req.user.student_id;
  const { category } = req.query; // all, Smart Alerts, Notices, Updates

  let query = 'SELECT id, type, title, message, time, unread, category FROM alerts WHERE student_id = ?';
  const params = [studentId];

  if (category && category !== 'All') {
    query += ' AND category = ?';
    params.push(category);
  }

  query += ' ORDER BY id DESC';

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    // Map unread boolean
    const mapped = rows.map(row => ({
      ...row,
      unread: row.unread === 1
    }));
    res.json(mapped);
  });
});

// PUT /alerts/:id/read - Mark alert as read
router.put('/alerts/:id/read', authMiddleware, (req, res) => {
  const studentId = req.user.student_id;
  const alertId = req.params.id;

  db.run('UPDATE alerts SET unread = 0 WHERE id = ? AND student_id = ?', [alertId, studentId], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Alert marked as read' });
  });
});

// GET /alerts/unread-count - Get total unread alerts
router.get('/alerts/unread-count', authMiddleware, (req, res) => {
  const studentId = req.user.student_id;
  db.get('SELECT COUNT(*) as count FROM alerts WHERE student_id = ? AND unread = 1', [studentId], (err, row) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ count: row ? row.count : 0 });
  });
});

// GET /notices - Get important notices
router.get('/notices', authMiddleware, (req, res) => {
  db.all('SELECT title, message, urgent FROM notices ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    const mapped = rows.map(r => ({
      title: r.title,
      message: r.message,
      urgent: r.urgent === 1
    }));
    res.json(mapped);
  });
});

module.exports = router;
