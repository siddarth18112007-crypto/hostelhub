const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'hostelhub.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    createTables();
  }
});

function createTables() {
  db.serialize(() => {
    // 1. Students Table
    db.run(`CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      student_id TEXT UNIQUE NOT NULL,
      course TEXT,
      batch TEXT,
      block TEXT,
      room TEXT,
      floor TEXT,
      roommates INTEGER DEFAULT 2,
      avatar TEXT
    )`);

    // 2. Roommates Table
    db.run(`CREATE TABLE IF NOT EXISTS roommates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL,
      name TEXT NOT NULL,
      roommate_id TEXT NOT NULL
    )`);

    // 3. Room Amenities Table
    db.run(`CREATE TABLE IF NOT EXISTS room_amenities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL,
      amenity TEXT NOT NULL
    )`);

    // 4. Mess Menu Table
    db.run(`CREATE TABLE IF NOT EXISTS mess_menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      meal_type TEXT NOT NULL, -- breakfast, lunch, snacks, dinner
      time TEXT NOT NULL,
      items TEXT NOT NULL -- JSON array of items
    )`);

    // 5. Laundry Slots Table
    db.run(`CREATE TABLE IF NOT EXISTS laundry_slots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      machine TEXT NOT NULL,
      status TEXT DEFAULT 'Booked'
    )`);

    // 6. Laundry History Table
    db.run(`CREATE TABLE IF NOT EXISTS laundry_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      machine TEXT NOT NULL,
      status TEXT DEFAULT 'Completed'
    )`);

    // 7. Repairs Table
    db.run(`CREATE TABLE IF NOT EXISTS repairs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL,
      issue TEXT NOT NULL,
      room TEXT NOT NULL,
      date TEXT NOT NULL,
      technician TEXT NOT NULL,
      status TEXT DEFAULT 'Reported'
    )`);

    // 8. Repair Steps Table (tracks progress for each repair)
    db.run(`CREATE TABLE IF NOT EXISTS repair_steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      repair_id INTEGER NOT NULL,
      label TEXT NOT NULL,
      done INTEGER DEFAULT 0, -- 0 = false, 1 = true
      current INTEGER DEFAULT 0, -- 0 = false, 1 = true
      FOREIGN KEY(repair_id) REFERENCES repairs(id) ON DELETE CASCADE
    )`);

    // 9. Events Table
    db.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      venue TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT DEFAULT 'Upcoming'
    )`);

    // 10. Resources Table
    db.run(`CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      desc TEXT NOT NULL,
      icon TEXT NOT NULL,
      available INTEGER DEFAULT 1 -- 0 = false, 1 = true
    )`);

    // 11. Schedule Items Table
    db.run(`CREATE TABLE IF NOT EXISTS schedule_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL,
      time TEXT NOT NULL,
      endTime TEXT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      location TEXT NOT NULL,
      type TEXT NOT NULL, -- mess, laundry, repair, events
      status TEXT NOT NULL, -- Completed, Upcoming, Scheduled
      day TEXT NOT NULL -- today, tomorrow
    )`);

    // 12. Alerts Table
    db.run(`CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      time TEXT NOT NULL,
      unread INTEGER DEFAULT 1, -- 0 = read, 1 = unread
      category TEXT NOT NULL
    )`);

    // 13. Notices Table
    db.run(`CREATE TABLE IF NOT EXISTS notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      urgent INTEGER DEFAULT 0 -- 0 = false, 1 = true
    )`);

    // 14. Settings Table
    db.run(`CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT UNIQUE NOT NULL,
      dark_mode INTEGER DEFAULT 0,
      notifications INTEGER DEFAULT 1,
      sound INTEGER DEFAULT 1
    )`);

    // 15. Notification Preferences Table
    db.run(`CREATE TABLE IF NOT EXISTS notification_prefs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT UNIQUE NOT NULL,
      mess_updates INTEGER DEFAULT 1,
      laundry_reminders INTEGER DEFAULT 1,
      repair_updates INTEGER DEFAULT 1,
      event_reminders INTEGER DEFAULT 1,
      notices INTEGER DEFAULT 1,
      smart_alerts INTEGER DEFAULT 1
    )`);

    // 16. Reports Table
    db.run(`CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL,
      category TEXT NOT NULL,
      subject TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  });
}

module.exports = db;
