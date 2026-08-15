const db = require('./database');
const bcrypt = require('bcryptjs');

db.serialize(() => {
  console.log('Seeding database...');

  // Clear existing data
  db.run('DELETE FROM students');
  db.run('DELETE FROM roommates');
  db.run('DELETE FROM room_amenities');
  db.run('DELETE FROM mess_menu');
  db.run('DELETE FROM laundry_slots');
  db.run('DELETE FROM laundry_history');
  db.run('DELETE FROM repairs');
  db.run('DELETE FROM repair_steps');
  db.run('DELETE FROM events');
  db.run('DELETE FROM resources');
  db.run('DELETE FROM schedule_items');
  db.run('DELETE FROM alerts');
  db.run('DELETE FROM notices');
  db.run('DELETE FROM settings');
  db.run('DELETE FROM notification_prefs');
  db.run('DELETE FROM reports');

  // Hash password
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('password123', salt);

  // Insert Student
  db.run(`INSERT INTO students (name, email, password_hash, student_id, course, batch, block, room, floor, roommates, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['Sid', 'sid@hostelhub.app', passwordHash, 'STU1024', 'B.Tech Computer Science', '2024–2028', 'B', '304', '3rd Floor', 2, null]
  );

  // Insert Roommates
  const roommates = [
    { student_id: 'STU1024', name: 'Arjun', roommate_id: 'STU1025' },
    { student_id: 'STU1024', name: 'Karthik', roommate_id: 'STU1026' }
  ];
  const stmtRoommates = db.prepare('INSERT INTO roommates (student_id, name, roommate_id) VALUES (?, ?, ?)');
  roommates.forEach(r => stmtRoommates.run([r.student_id, r.name, r.roommate_id]));
  stmtRoommates.finalize();

  // Insert Room Amenities
  const amenities = ['Bed', 'Study Table', 'Chair', 'Wardrobe', 'Fan', 'Light', 'Power Outlets'];
  const stmtAmenities = db.prepare('INSERT INTO room_amenities (student_id, amenity) VALUES (?, ?)');
  amenities.forEach(a => stmtAmenities.run(['STU1024', a]));
  stmtAmenities.finalize();

  // Insert Mess Menu
  const messMenu = [
    { meal_type: 'breakfast', time: '08:00 AM – 09:00 AM', items: JSON.stringify(['Idli & Sambar', 'Dosa', 'Bread & Jam', 'Cornflakes', 'Tea / Coffee']) },
    { meal_type: 'lunch', time: '12:30 PM – 02:00 PM', items: JSON.stringify(['Paneer Butter Masala', 'Roti', 'Rice', 'Dal Tadka']) },
    { meal_type: 'snacks', time: '04:30 PM – 05:30 PM', items: JSON.stringify(['Samosa', 'Tea / Coffee']) },
    { meal_type: 'dinner', time: '07:30 PM – 09:00 PM', items: JSON.stringify(['Aloo Gobi', 'Puri', 'Veg Pulao', 'Gulab Jamun']) }
  ];
  const stmtMess = db.prepare('INSERT INTO mess_menu (meal_type, time, items) VALUES (?, ?, ?)');
  messMenu.forEach(m => stmtMess.run([m.meal_type, m.time, m.items]));
  stmtMess.finalize();

  // Insert Laundry Slots
  const laundrySlots = [
    { student_id: 'STU1024', date: 'Today', time: '02:00 PM – 03:00 PM', machine: 'Machine 3', status: 'Booked' },
    { student_id: 'STU1024', date: 'Tomorrow', time: '10:00 AM – 11:00 AM', machine: 'Machine 1', status: 'Booked' }
  ];
  const stmtLaundry = db.prepare('INSERT INTO laundry_slots (student_id, date, time, machine, status) VALUES (?, ?, ?, ?, ?)');
  laundrySlots.forEach(l => stmtLaundry.run([l.student_id, l.date, l.time, l.machine, l.status]));
  stmtLaundry.finalize();

  // Insert Laundry History
  const laundryHistory = [
    { student_id: 'STU1024', date: '12 Aug', time: '10:00 AM', machine: 'Machine 2', status: 'Completed' },
    { student_id: 'STU1024', date: '8 Aug', time: '03:00 PM', machine: 'Machine 3', status: 'Completed' }
  ];
  const stmtLaundryHist = db.prepare('INSERT INTO laundry_history (student_id, date, time, machine, status) VALUES (?, ?, ?, ?, ?)');
  laundryHistory.forEach(l => stmtLaundryHist.run([l.student_id, l.date, l.time, l.machine, l.status]));
  stmtLaundryHist.finalize();

  // Insert Repairs
  db.run(`INSERT INTO repairs (id, student_id, issue, room, date, technician, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [1, 'STU1024', 'AC Not Cooling', 'Req #1042', 'Logged Yesterday', 'Arun', 'Scheduled'],
    function(err) {
      if (err) return console.error('Error seeding active repair:', err.message);
      // Insert active repair steps
      const steps = [
        { label: 'Reported', done: 1, current: 0 },
        { label: 'Assigned', done: 1, current: 0 },
        { label: 'Scheduled', done: 0, current: 1 },
        { label: 'Completed', done: 0, current: 0 }
      ];
      const stmtSteps = db.prepare('INSERT INTO repair_steps (repair_id, label, done, current) VALUES (?, ?, ?, ?)');
      steps.forEach(s => stmtSteps.run([1, s.label, s.done, s.current]));
      stmtSteps.finalize();
    }
  );

  const repairHistory = [
    { student_id: 'STU1024', issue: 'Light flickering', room: 'Room 304', date: '10 Aug', status: 'Completed', technician: 'Ravi' },
    { student_id: 'STU1024', issue: 'Door lock issue', room: 'Room 304', date: '5 Aug', status: 'Completed', technician: 'Kumar' }
  ];
  const stmtRepHist = db.prepare('INSERT INTO repairs (student_id, issue, room, date, technician, status) VALUES (?, ?, ?, ?, ?, ?)');
  repairHistory.forEach(r => stmtRepHist.run([r.student_id, r.issue, r.room, r.date, r.technician, r.status]));
  stmtRepHist.finalize();

  // Insert Events
  const events = [
    { title: 'Hostel Cricket Cup', date: '20 Aug', time: '5:00 PM', venue: 'Ground 2', type: 'Sports', status: 'Upcoming' },
    { title: 'Movie Night', date: '22 Aug', time: '7:00 PM', venue: 'Common Room', type: 'Entertainment', status: 'Upcoming' },
    { title: 'Chess Tournament', date: '25 Aug', time: '4:00 PM', venue: 'Recreation Hall', type: 'Sports', status: 'Upcoming' },
    { title: "Fresher's Welcome", date: '1 Aug', time: '6:00 PM', venue: 'Main Hall', type: 'Cultural', status: 'Completed' },
    { title: 'Coding Bootcamp', date: '28 Jul', time: '10:00 AM', venue: 'Lab 3', type: 'Academic', status: 'Completed' }
  ];
  const stmtEvents = db.prepare('INSERT INTO events (title, date, time, venue, type, status) VALUES (?, ?, ?, ?, ?, ?)');
  events.forEach(e => stmtEvents.run([e.title, e.date, e.time, e.venue, e.type, e.status]));
  stmtEvents.finalize();

  // Insert Resources
  const resources = [
    { name: 'Study Room', desc: 'Open 24/7', icon: 'book-open', available: 1 },
    { name: 'Gym', desc: '6 AM – 10 PM', icon: 'dumbbell', available: 1 },
    { name: 'Common Room', desc: 'TV, Games', icon: 'tv', available: 1 },
    { name: 'WiFi', desc: 'HostelNet', icon: 'wifi', available: 1 },
    { name: 'Parking', desc: 'Basement B1', icon: 'car', available: 1 },
    { name: 'Medical Room', desc: '9 AM – 5 PM', icon: 'heart-pulse', available: 1 }
  ];
  const stmtRes = db.prepare('INSERT INTO resources (name, desc, icon, available) VALUES (?, ?, ?, ?)');
  resources.forEach(r => stmtRes.run([r.name, r.desc, r.icon, r.available]));
  stmtRes.finalize();

  // Insert Schedule Items
  const schedules = [
    { student_id: 'STU1024', time: '08:00 AM', endTime: '09:00 AM', title: 'Breakfast', category: 'Mess', location: 'Main Mess', type: 'mess', status: 'Completed', day: 'today' },
    { student_id: 'STU1024', time: '10:00 AM - NOW', endTime: '', title: 'Advanced Physics', category: 'Academic', location: 'Lecture Hall B', type: 'academic', status: 'Upcoming', day: 'today' },
    { student_id: 'STU1024', time: '02:00 PM', endTime: '', title: 'Laundry Slot', category: 'Laundry', location: 'Block B Basement', type: 'laundry', status: 'Scheduled', day: 'today' },
    { student_id: 'STU1024', time: '08:00 AM', endTime: '09:00 AM', title: 'Breakfast', category: 'Mess', location: 'Main Mess', type: 'mess', status: 'Upcoming', day: 'tomorrow' },
    { student_id: 'STU1024', time: '10:00 AM', endTime: '11:00 AM', title: 'Laundry Slot', category: 'Laundry', location: 'Block B Laundry', type: 'laundry', status: 'Scheduled', day: 'tomorrow' },
    { student_id: 'STU1024', time: '12:30 PM', endTime: '02:00 PM', title: 'Lunch', category: 'Mess', location: 'Main Mess', type: 'mess', status: 'Upcoming', day: 'tomorrow' },
    { student_id: 'STU1024', time: '02:00 PM', endTime: '04:00 PM', title: 'AC Repair', category: 'Repair', location: 'Room 304', type: 'repair', status: 'Scheduled', day: 'tomorrow' }
  ];
  const stmtSched = db.prepare('INSERT INTO schedule_items (student_id, time, endTime, title, category, location, type, status, day) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  schedules.forEach(s => stmtSched.run([s.student_id, s.time, s.endTime, s.title, s.category, s.location, s.type, s.status, s.day]));
  stmtSched.finalize();

  // Insert Alerts
  const alerts = [
    { student_id: 'STU1024', type: 'smart', title: 'Security Update', message: 'New visitor entry rules starting Monday, 17 Aug. Please check...', time: '10:45 AM', unread: 1, category: 'Smart Alerts' },
    { student_id: 'STU1024', type: 'mess', title: 'Special Dinner Tonight', message: 'Paneer Butter Masala served at 7:30 PM in Main Mess.', time: '09:00 AM', unread: 1, category: 'Updates' },
    { student_id: 'STU1024', type: 'notice', title: 'Water Shutdown', message: 'Maintenance in Block B from 2:00 PM to 4:00 PM.', time: '13 Aug', unread: 0, category: 'Notices' },
    { student_id: 'STU1024', type: 'events', title: 'Hostel Cricket Cup', message: 'Match rescheduled to 20 Aug, 5:00 PM at the main ground.', time: '12 Aug', unread: 0, category: 'Smart Alerts' }
  ];
  const stmtAlerts = db.prepare('INSERT INTO alerts (student_id, type, title, message, time, unread, category) VALUES (?, ?, ?, ?, ?, ?, ?)');
  alerts.forEach(a => stmtAlerts.run([a.student_id, a.type, a.title, a.message, a.time, a.unread, a.category]));
  stmtAlerts.finalize();

  // Insert Notices
  db.run(`INSERT INTO notices (title, message, urgent)
    VALUES (?, ?, ?)`,
    ['Important Notice', 'Water supply will be interrupted tomorrow from 9:00 AM to 11:00 AM.', 1]
  );

  // Insert Settings & Notification Preferences
  db.run(`INSERT INTO settings (student_id, dark_mode, notifications, sound)
    VALUES (?, ?, ?, ?)`,
    ['STU1024', 0, 1, 1]
  );

  db.run(`INSERT INTO notification_prefs (student_id, mess_updates, laundry_reminders, repair_updates, event_reminders, notices, smart_alerts)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ['STU1024', 1, 1, 1, 1, 1, 1]
  );

  console.log('Database successfully seeded.');
});
