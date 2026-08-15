const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

// GET /profile - Get student profile details, roommates, and amenities
router.get('/profile', authMiddleware, (req, res) => {
  const studentId = req.user.student_id;

  db.get('SELECT id, name, email, student_id, course, batch, block, room, floor, roommates, avatar FROM students WHERE student_id = ?', [studentId], (err, profile) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!profile) return res.status(404).json({ message: 'Student not found' });

    // Fetch roommates
    db.all('SELECT name, roommate_id as id FROM roommates WHERE student_id = ?', [studentId], (err, roommates) => {
      if (err) return res.status(500).json({ message: err.message });
      profile.roommatesList = roommates;

      // Fetch room amenities
      db.all('SELECT amenity FROM room_amenities WHERE student_id = ?', [studentId], (err, amenities) => {
        if (err) return res.status(500).json({ message: err.message });
        profile.amenities = amenities.map(a => a.amenity);
        res.json(profile);
      });
    });
  });
});

// PUT /profile - Update student profile
router.put('/profile', authMiddleware, (req, res) => {
  const studentId = req.user.student_id;
  const { course, batch } = req.body;

  db.run('UPDATE students SET course = ?, batch = ? WHERE student_id = ?', [course, batch, studentId], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Profile updated successfully' });
  });
});

// GET /settings
router.get('/settings', authMiddleware, (req, res) => {
  const studentId = req.user.student_id;
  db.get('SELECT dark_mode, notifications, sound FROM settings WHERE student_id = ?', [studentId], (err, settings) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!settings) {
      // Return default settings if none found
      return res.json({ dark_mode: 0, notifications: 1, sound: 1 });
    }
    res.json(settings);
  });
});

// PUT /settings
router.put('/settings', authMiddleware, (req, res) => {
  const studentId = req.user.student_id;
  const { dark_mode, notifications, sound } = req.body;

  db.run(`INSERT OR REPLACE INTO settings (student_id, dark_mode, notifications, sound)
    VALUES (?, ?, ?, ?)`,
    [studentId, dark_mode ? 1 : 0, notifications ? 1 : 0, sound ? 1 : 0],
    function(err) {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: 'Settings updated successfully' });
    }
  );
});

// GET /preferences (notification preferences)
router.get('/preferences', authMiddleware, (req, res) => {
  const studentId = req.user.student_id;
  db.get('SELECT mess_updates, laundry_reminders, repair_updates, event_reminders, notices, smart_alerts FROM notification_prefs WHERE student_id = ?', [studentId], (err, prefs) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!prefs) {
      return res.json({ mess_updates: 1, laundry_reminders: 1, repair_updates: 1, event_reminders: 1, notices: 1, smart_alerts: 1 });
    }
    res.json(prefs);
  });
});

// PUT /preferences
router.put('/preferences', authMiddleware, (req, res) => {
  const studentId = req.user.student_id;
  const { mess_updates, laundry_reminders, repair_updates, event_reminders, notices, smart_alerts } = req.body;

  db.run(`INSERT OR REPLACE INTO notification_prefs (student_id, mess_updates, laundry_reminders, repair_updates, event_reminders, notices, smart_alerts)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      studentId,
      mess_updates ? 1 : 0,
      laundry_reminders ? 1 : 0,
      repair_updates ? 1 : 0,
      event_reminders ? 1 : 0,
      notices ? 1 : 0,
      smart_alerts ? 1 : 0
    ],
    function(err) {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: 'Notification preferences updated successfully' });
    }
  );
});

module.exports = router;
