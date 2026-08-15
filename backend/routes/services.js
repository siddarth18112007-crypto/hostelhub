const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

// --- MESS SERVICE ---
router.get('/mess/menu', authMiddleware, (req, res) => {
  db.all('SELECT meal_type, time, items FROM mess_menu', (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    
    const menu = {};
    rows.forEach(row => {
      menu[row.meal_type] = {
        time: row.time,
        items: JSON.parse(row.items)
      };
    });
    res.json(menu);
  });
});

// --- LAUNDRY SERVICE ---
// GET laundry slots
router.get('/laundry/slots', authMiddleware, (req, res) => {
  const studentId = req.user.student_id;
  db.all('SELECT id, date, time, machine, status FROM laundry_slots WHERE student_id = ?', [studentId], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

// POST book laundry slot
router.post('/laundry/book', authMiddleware, (req, res) => {
  const studentId = req.user.student_id;
  const { date, time, machine } = req.body;

  if (!date || !time || !machine) {
    return res.status(400).json({ message: 'Date, time, and machine are required' });
  }

  db.serialize(() => {
    // Insert slot booking
    db.run('INSERT INTO laundry_slots (student_id, date, time, machine, status) VALUES (?, ?, ?, ?, ?)',
      [studentId, date, time, machine, 'Booked'],
      function(err) {
        if (err) return res.status(500).json({ message: err.message });

        // Add to schedule items
        db.run('INSERT INTO schedule_items (student_id, time, endTime, title, category, location, type, status, day) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [studentId, time.split(' – ')[0], time.split(' – ')[1] || '', 'Laundry Slot', 'Laundry', 'Block B Laundry', 'laundry', 'Scheduled', date.toLowerCase() === 'tomorrow' ? 'tomorrow' : 'today'],
          (err) => {
            if (err) console.error('Schedule item error:', err.message);
          }
        );

        // Add smart alert
        db.run('INSERT INTO alerts (student_id, type, title, message, time, unread, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [studentId, 'laundry', 'Laundry Booking', `Your laundry slot is booked on ${date} at ${time} on ${machine}.`, 'Just now', 1, 'Smart Alerts'],
          (err) => {
            if (err) console.error('Alert item error:', err.message);
          }
        );

        res.json({ message: 'Laundry slot booked successfully', bookingId: this.lastID });
      }
    );
  });
});

// GET laundry history
router.get('/laundry/history', authMiddleware, (req, res) => {
  const studentId = req.user.student_id;
  db.all('SELECT date, time, machine, status FROM laundry_history WHERE student_id = ? ORDER BY id DESC', [studentId], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});


// --- REPAIR SERVICE ---
// GET active repair
router.get('/repair/active', authMiddleware, (req, res) => {
  const studentId = req.user.student_id;
  // Get the most recent non-completed repair
  db.get('SELECT * FROM repairs WHERE student_id = ? AND status != "Completed" ORDER BY id DESC LIMIT 1', [studentId], (err, repair) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!repair) return res.json(null);

    // Get status steps for this repair
    db.all('SELECT label, done, current FROM repair_steps WHERE repair_id = ? ORDER BY id ASC', [repair.id], (err, steps) => {
      if (err) return res.status(500).json({ message: err.message });
      
      // Convert SQLite 0/1 back to booleans
      repair.steps = steps.map(s => ({
        label: s.label,
        done: s.done === 1,
        current: s.current === 1
      }));
      res.json(repair);
    });
  });
});

// POST new repair request
router.post('/repair/new', authMiddleware, (req, res) => {
  const studentId = req.user.student_id;
  const { issue, room } = req.body;

  if (!issue || !room) {
    return res.status(400).json({ message: 'Issue and room are required' });
  }

  db.serialize(() => {
    // Insert repair request
    db.run('INSERT INTO repairs (student_id, issue, room, date, technician, status) VALUES (?, ?, ?, ?, ?, ?)',
      [studentId, issue, room, 'Pending scheduling', 'Unassigned', 'Reported'],
      function(err) {
        if (err) return res.status(500).json({ message: err.message });
        const repairId = this.lastID;

        // Insert repair steps
        const steps = [
          { label: 'Reported', done: 1, current: 0 },
          { label: 'Assigned', done: 0, current: 1 },
          { label: 'Scheduled', done: 0, current: 0 },
          { label: 'Completed', done: 0, current: 0 }
        ];
        const stmtSteps = db.prepare('INSERT INTO repair_steps (repair_id, label, done, current) VALUES (?, ?, ?, ?)');
        steps.forEach(s => stmtSteps.run([repairId, s.label, s.done, s.current]));
        stmtSteps.finalize();

        // Add smart alert
        db.run('INSERT INTO alerts (student_id, type, title, message, time, unread, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [studentId, 'repair', 'Repair Request Filed', `Your repair request for "${issue}" has been reported.`, 'Just now', 1, 'Smart Alerts'],
          (err) => {
            if (err) console.error('Alert item error:', err.message);
          }
        );

        res.json({ message: 'Repair request submitted successfully', repairId });
      }
    );
  });
});

// GET repair history
router.get('/repair/history', authMiddleware, (req, res) => {
  const studentId = req.user.student_id;
  db.all('SELECT issue, room, date, technician, status FROM repairs WHERE student_id = ? AND status = "Completed" ORDER BY id DESC', [studentId], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});


// --- EVENTS SERVICE ---
router.get('/events', authMiddleware, (req, res) => {
  db.all('SELECT title, date, time, venue, type, status FROM events ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    
    const upcoming = rows.filter(e => e.status !== 'Completed');
    const past = rows.filter(e => e.status === 'Completed');
    
    res.json({ upcoming, past });
  });
});


// --- RESOURCES SERVICE ---
router.get('/resources', authMiddleware, (req, res) => {
  db.all('SELECT name, desc, icon, available FROM resources', (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    // Map SQLite boolean back
    const mapped = rows.map(r => ({
      name: r.name,
      desc: r.desc,
      icon: r.icon,
      available: r.available === 1
    }));
    res.json(mapped);
  });
});


// --- REPORTS SERVICE ---
router.post('/reports', authMiddleware, (req, res) => {
  const studentId = req.user.student_id;
  const { category, subject, description } = req.body;

  if (!category || !subject || !description) {
    return res.status(400).json({ message: 'Category, subject, and description are required' });
  }

  db.run('INSERT INTO reports (student_id, category, subject, description) VALUES (?, ?, ?, ?)',
    [studentId, category, subject, description],
    function(err) {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: 'Report submitted successfully', reportId: this.lastID });
    }
  );
});

module.exports = router;
