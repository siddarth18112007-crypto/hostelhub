const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const serviceRoutes = require('./routes/services');
const notificationRoutes = require('./routes/notifications');
const scheduleRoutes = require('./routes/schedule');
const miscRoutes = require('./routes/misc');

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/misc', miscRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the HostelHub Backend API!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`HostelHub backend server running on port ${PORT}`);
});
