const ApiService = {
  BASE_URL: 'http://localhost:3001/api',
  token: SafeStorage.getItem('hh_token') || null,
  isBackendOffline: true,
  cache: {},

  // Initialize client-side persistent database
  initLocalDB() {
    console.log('Initializing LocalStorage database for HostelHub...');
    
    const defaultData = {
      students: [
        { id: 'STU1024', name: 'Sid', email: 'sid@hostelhub.app', role: 'STUDENT', block: 'B', room: '304', floor: '3rd Floor', course: 'B.Tech Computer Science', batch: '2024–2028', roommatesCount: 2 },
        { id: 'WRD2048', name: 'Dr. Ramesh (Warden)', email: 'warden@hostelhub.app', role: 'ADMIN' },
        { id: 'STF4096', name: 'Arun (Technician)', email: 'staff@hostelhub.app', role: 'STAFF' }
      ],
      roommates: [
        { student_id: 'STU1024', name: 'Arjun', id: 'STU1025' },
        { student_id: 'STU1024', name: 'Karthik', id: 'STU1026' }
      ],
      amenities: ['Bed', 'Study Table', 'Chair', 'Wardrobe', 'Fan', 'Light', 'Power Outlets'],
      weather: { temp: 29, city: 'Chennai', condition: 'Sunny' },
      forYou: [
        { type: 'laundry', title: 'Laundry Slot Approaching', desc: 'Today, 2:00 PM - 3:00 PM', icon: 'washing-machine' },
        { type: 'repair', title: 'Repair Scheduled', desc: 'AC Maintenance - Tomorrow', icon: 'wrench' }
      ],
      services: [
        { id: 'room', name: 'Room', desc: 'Details, roommates, amenities', icon: 'bed-double', bgColor: '#EEF4FF', iconColor: '#1D43B6' },
        { id: 'mess', name: 'Mess', desc: 'Menu, timings, feedback', icon: 'utensils', bgColor: '#F0F6FF', iconColor: '#326DF0' },
        { id: 'laundry', name: 'Laundry', desc: 'Book slot, status, history', icon: 'washing-machine', bgColor: '#EAF1FF', iconColor: '#061258' },
        { id: 'repair', name: 'Repair', desc: 'Request, track, history', icon: 'wrench', bgColor: '#FFF0F1', iconColor: '#E04B55' },
        { id: 'events', name: 'Events', desc: 'Upcoming, past, register', icon: 'calendar-days', bgColor: '#EDF9F2', iconColor: '#35A86F' },
        { id: 'resources', name: 'Resources', desc: 'Study room, gym, WiFi', icon: 'library', bgColor: '#EDFAFA', iconColor: '#22A6A6' }
      ],
      todaySchedule: [
        { time: '08:00 AM', title: 'Breakfast', category: 'Mess', location: 'Main Mess', status: 'Completed', type: 'mess', icon: 'utensils' },
        { time: '10:00 AM - NOW', title: 'Advanced Physics', category: 'Academic', location: 'Lecture Hall B', status: 'Upcoming', type: 'academic', icon: 'graduation-cap', isActive: true },
        { time: '02:00 PM', title: 'Laundry Slot', category: 'Laundry', location: 'Block B Basement', status: 'Scheduled', type: 'laundry', icon: 'washing-machine' }
      ],
      tomorrowSchedule: [
        { time: '08:00 AM', title: 'Breakfast', category: 'Mess', location: 'Main Mess', status: 'Upcoming', type: 'mess', icon: 'utensils' },
        { time: '10:00 AM', title: 'Laundry Slot', category: 'Laundry', location: 'Block B Laundry', status: 'Scheduled', type: 'laundry', icon: 'washing-machine' },
        { time: '12:30 PM', title: 'Lunch', category: 'Mess', location: 'Main Mess', status: 'Upcoming', type: 'mess', icon: 'utensils' },
        { time: '02:00 PM', title: 'AC Repair', category: 'Repair', location: 'Room 304', status: 'Scheduled', type: 'repair', icon: 'wrench' }
      ],
      messMenu: {
        breakfast: { time: '08:00 AM – 09:00 AM', items: ['Idli & Sambar', 'Dosa', 'Bread & Jam', 'Cornflakes', 'Tea / Coffee'] },
        lunch: { time: '12:30 PM – 02:00 PM', items: ['Paneer Butter Masala', 'Roti', 'Rice', 'Dal Tadka'] },
        snacks: { time: '04:30 PM – 05:30 PM', items: ['Samosa', 'Tea / Coffee'] },
        dinner: { time: '07:30 PM – 09:00 PM', items: ['Aloo Gobi', 'Puri', 'Veg Pulao', 'Gulab Jamun'] }
      },
      activeRepair: {
        id: 1042,
        issue: 'AC Not Cooling',
        room: 'Room 304',
        date: 'Logged Yesterday',
        technician: 'Arun',
        status: 'Scheduled',
        steps: [
          { label: 'Reported', done: true },
          { label: 'Assigned', done: true },
          { label: 'Scheduled', done: false, current: true },
          { label: 'Completed', done: false }
        ]
      },
      repairs: [
        { id: 1042, student_id: 'STU1024', issue: 'AC Not Cooling', room: 'Room 304', date: 'Logged Yesterday', technician: 'Arun', status: 'Scheduled', steps: [{ label: 'Reported', done: true }, { label: 'Assigned', done: true }, { label: 'Scheduled', done: false, current: true }, { label: 'Completed', done: false }] },
        { id: 1021, student_id: 'STU1024', issue: 'Light flickering', room: 'Room 304', date: '10 Aug', status: 'Completed', technician: 'Ravi' },
        { id: 1005, student_id: 'STU1024', issue: 'Door lock issue', room: 'Room 304', date: '5 Aug', status: 'Completed', technician: 'Kumar' }
      ],
      laundrySlots: [
        { id: 1, date: 'Today', time: '02:00 PM – 03:00 PM', machine: 'Machine 3', status: 'Booked', student_id: 'STU1024' },
        { id: 2, date: 'Tomorrow', time: '10:00 AM – 11:00 AM', machine: 'Machine 1', status: 'Booked', student_id: 'STU1024' }
      ],
      laundryHistory: [
        { date: '12 Aug', time: '10:00 AM', machine: 'Machine 2', status: 'Completed' },
        { date: '8 Aug', time: '03:00 PM', machine: 'Machine 3', status: 'Completed' }
      ],
      events: [
        { id: 1, title: 'Hostel Cricket Cup', date: '20 Aug', time: '5:00 PM', venue: 'Ground 2', type: 'Sports', status: 'Upcoming', registered: false, maxCapacity: 100, currentRegistrations: 42 },
        { id: 2, title: 'Movie Night', date: '22 Aug', time: '7:00 PM', venue: 'Common Room', type: 'Entertainment', status: 'Upcoming', registered: false, maxCapacity: 50, currentRegistrations: 15 },
        { id: 3, title: 'Chess Tournament', date: '25 Aug', time: '4:00 PM', venue: 'Recreation Hall', type: 'Sports', status: 'Upcoming', registered: false, maxCapacity: 32, currentRegistrations: 8 }
      ],
      pastEvents: [
        { title: "Fresher's Welcome", date: '1 Aug', time: '6:00 PM', venue: 'Main Hall', type: 'Cultural', status: 'Completed' },
        { title: 'Coding Bootcamp', date: '28 Jul', time: '10:00 AM', venue: 'Lab 3', type: 'Academic', status: 'Completed' }
      ],
      resources: [
        { name: 'Study Room', desc: 'Open 24/7', icon: 'book-open', available: true, status: 'AVAILABLE', location: 'Block B, 1st Floor' },
        { name: 'Gym', desc: '6 AM – 10 PM', icon: 'dumbbell', available: true, status: 'AVAILABLE', location: 'Ground Floor' },
        { name: 'Common Room', desc: 'TV, Games', icon: 'tv', available: true, status: 'AVAILABLE', location: 'Block A, 1st Floor' },
        { name: 'WiFi', desc: 'HostelNet', icon: 'wifi', available: true, status: 'AVAILABLE', location: 'All Blocks' },
        { name: 'Parking', desc: 'Basement B1', icon: 'car', available: true, status: 'AVAILABLE', location: 'Basement' },
        { name: 'Medical Room', desc: '9 AM – 5 PM', icon: 'heart-pulse', available: true, status: 'AVAILABLE', location: 'Block B, Ground Floor' }
      ],
      alerts: [
        { id: 1, type: 'smart', title: 'Security Update', message: 'New visitor entry rules starting Monday, 17 Aug. Please check...', time: '10:45 AM', unread: true, category: 'Smart Alerts' },
        { id: 2, type: 'mess', title: 'Special Dinner Tonight', message: 'Paneer Butter Masala served at 7:30 PM in Main Mess.', time: '09:00 AM', unread: true, category: 'Updates' },
        { id: 3, type: 'notice', title: 'Water Shutdown', message: 'Maintenance in Block B from 2:00 PM to 4:00 PM.', time: '13 Aug', unread: false, category: 'Notices' },
        { id: 4, type: 'events', title: 'Hostel Cricket Cup', message: 'Match rescheduled to 20 Aug, 5:00 PM at the main ground.', time: '12 Aug', unread: false, category: 'Smart Alerts' }
      ],
      notice: {
        title: 'Important Notice',
        message: 'Water supply will be interrupted tomorrow from 9:00 AM to 11:00 AM.',
        urgent: true
      },
      notices: [
        { id: 1, title: 'Important Notice', message: 'Water supply will be interrupted tomorrow from 9:00 AM to 11:00 AM.', urgent: true, date: '14 Aug' }
      ],
      resourceReservations: []
    };

    // Store in localStorage if they don't exist
    for (const [key, val] of Object.entries(defaultData)) {
      const storageKey = `hh_db_${key}`;
      if (!SafeStorage.getItem(storageKey)) {
        SafeStorage.setItem(storageKey, JSON.stringify(val));
      }
    }
  },

  dbRead(table) {
    const data = SafeStorage.getItem(`hh_db_${table}`);
    return data ? JSON.parse(data) : [];
  },

  dbWrite(table, data) {
    SafeStorage.setItem(`hh_db_${table}`, JSON.stringify(data));
  },

  setToken(token) {
    this.token = token;
    if (token) {
      SafeStorage.setItem('hh_token', token);
    } else {
      SafeStorage.removeItem('hh_token');
      SafeStorage.removeItem('hh_session');
    }
  },

  // Check if server is running in the background. If it responds, we enable backend integration.
  async checkServerLiveness() {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 300);
      const res = await fetch('http://localhost:3001/', { signal: controller.signal });
      clearTimeout(id);
      if (res.ok) {
        this.isBackendOffline = false;
        console.log('HostelHub backend server detected. API mode activated.');
      }
    } catch (e) {
      this.isBackendOffline = true;
      console.log('HostelHub backend offline. Running in 100% Client-Side Mock Data Mode.');
    }
  },

  async request(endpoint, options = {}) {
    const url = `${this.BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);

    try {
      const response = await fetch(url, { 
        ...options, 
        headers,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.status === 401 || response.status === 403) {
        this.setToken(null);
        window.location.hash = 'login';
        throw new Error('Unauthorized');
      }
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'API request failed');
      }
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  },

  // --- AUTHENTICATION ---
  async login(email, password) {
    if (!this.isBackendOffline) {
      try {
        const res = await this.request('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
        this.setToken(res.token);
        SafeStorage.setItem('hh_session', JSON.stringify(res.profile));
        return res;
      } catch (err) {
        console.warn('Real API login failed, attempting local fallback:', err.message);
      }
    }

    const students = this.dbRead('students');
    const user = students.find(s => s.email === email.trim());
    if (!user) throw new Error('Invalid email or password');
    
    this.setToken('mock_jwt_' + user.role);
    SafeStorage.setItem('hh_session', JSON.stringify(user));
    return { profile: user, token: 'mock_jwt_' + user.role };
  },

  logout() {
    this.setToken(null);
  },

  getCurrentUser() {
    const session = SafeStorage.getItem('hh_session');
    return session ? JSON.parse(session) : null;
  },

  // --- PROFILE ---
  async getProfile() {
    if (!this.isBackendOffline) {
      try {
        return await this.request('/student/profile');
      } catch (err) {
        console.warn('Real API failed, showing local:', err.message);
      }
    }

    const user = this.getCurrentUser();
    if (!user) return null;
    const profile = { ...user };
    profile.roommatesList = this.dbRead('roommates').filter(r => r.student_id === user.id);
    profile.amenities = this.dbRead('amenities');
    return profile;
  },

  // --- WEATHER ---
  async getWeather() {
    if (!this.isBackendOffline) {
      try {
        return await this.request('/misc/weather');
      } catch (err) {}
    }
    return this.dbRead('weather') || { temp: 29, city: 'Chennai', condition: 'Sunny' };
  },

  // --- MESS MENU ---
  async getMessMenu() {
    if (!this.isBackendOffline) {
      try {
        return await this.request('/services/mess/menu');
      } catch (err) {}
    }
    return this.dbRead('messMenu');
  },

  // --- LAUNDRY SERVICES ---
  async getLaundrySlots() {
    if (!this.isBackendOffline) {
      try {
        return await this.request('/services/laundry/slots');
      } catch (err) {}
    }
    const user = this.getCurrentUser();
    const allSlots = this.dbRead('laundrySlots');
    return allSlots.filter(s => s.student_id === user.id);
  },

  async bookLaundrySlot(date, time, machine) {
    if (!this.isBackendOffline) {
      try {
        return await this.request('/services/laundry/book', {
          method: 'POST',
          body: JSON.stringify({ date, time, machine })
        });
      } catch (err) {
        console.warn('Real API booking failed, doing local simulation:', err.message);
      }
    }

    const user = this.getCurrentUser();
    const allSlots = this.dbRead('laundrySlots');
    const hasConflict = allSlots.some(s => s.student_id === user.id && s.date === date && s.time === time);
    if (hasConflict) {
      throw new Error('You already have a laundry slot booked for this date and time.');
    }

    const newSlot = {
      id: Date.now(),
      date,
      time,
      machine,
      status: 'Booked',
      student_id: user.id
    };
    allSlots.unshift(newSlot);
    this.dbWrite('laundrySlots', allSlots);

    const todaySchedule = this.dbRead('todaySchedule');
    const tomorrowSchedule = this.dbRead('tomorrowSchedule');
    const targetSchedule = date.toLowerCase() === 'tomorrow' ? tomorrowSchedule : todaySchedule;

    targetSchedule.push({
      time: time.split(' – ')[0] || time.split(' - ')[0],
      title: 'Laundry Slot',
      category: 'Laundry',
      location: 'Block B Laundry',
      status: 'Scheduled',
      type: 'laundry',
      icon: 'washing-machine'
    });

    this.dbWrite('todaySchedule', todaySchedule);
    this.dbWrite('tomorrowSchedule', tomorrowSchedule);

    const alerts = this.dbRead('alerts');
    alerts.unshift({
      id: Date.now(),
      type: 'laundry',
      title: 'Laundry Booking Confirmed',
      message: `Your laundry slot is booked on ${date} at ${time} on ${machine}.`,
      time: 'Just now',
      unread: true,
      category: 'Smart Alerts'
    });
    this.dbWrite('alerts', alerts);

    return { message: 'Slot booked successfully' };
  },

  async getLaundryHistory() {
    if (!this.isBackendOffline) {
      try {
        return await this.request('/services/laundry/history');
      } catch (err) {}
    }
    return this.dbRead('laundryHistory');
  },

  // --- REPAIRS ---
  async getActiveRepair() {
    if (!this.isBackendOffline) {
      try {
        return await this.request('/services/repair/active');
      } catch (err) {}
    }
    const user = this.getCurrentUser();
    const allRepairs = this.dbRead('repairs');
    return allRepairs.find(r => r.student_id === user.id && r.status !== 'Completed');
  },

  async submitRepairRequest(issue, room) {
    if (!this.isBackendOffline) {
      try {
        return await this.request('/services/repair/new', {
          method: 'POST',
          body: JSON.stringify({ issue, room })
        });
      } catch (err) {
        console.warn('Real API repair request failed, doing local simulation:', err.message);
      }
    }

    const user = this.getCurrentUser();
    const allRepairs = this.dbRead('repairs');
    const newRepair = {
      id: Math.floor(Math.random() * 9000) + 1000,
      student_id: user.id,
      issue,
      room: room || `Room ${user.room || '304'}`,
      date: 'Logged Just Now',
      technician: 'Unassigned',
      status: 'Reported',
      steps: [
        { label: 'Reported', done: true },
        { label: 'Assigned', done: false, current: true },
        { label: 'Scheduled', done: false },
        { label: 'Completed', done: false }
      ]
    };

    allRepairs.unshift(newRepair);
    this.dbWrite('repairs', allRepairs);

    const alerts = this.dbRead('alerts');
    alerts.unshift({
      id: Date.now(),
      type: 'repair',
      title: 'Repair Request Logged',
      message: `Your request for "${issue}" has been reported successfully.`,
      time: 'Just now',
      unread: true,
      category: 'Smart Alerts'
    });
    this.dbWrite('alerts', alerts);

    return newRepair;
  },

  async getRepairHistory() {
    if (!this.isBackendOffline) {
      try {
        return await this.request('/services/repair/history');
      } catch (err) {}
    }
    const user = this.getCurrentUser();
    const allRepairs = this.dbRead('repairs');
    return allRepairs.filter(r => r.student_id === user.id && r.status === 'Completed');
  },

  // --- EVENTS ---
  async getEvents() {
    if (!this.isBackendOffline) {
      try {
        return await this.request('/services/events');
      } catch (err) {}
    }
    const list = this.dbRead('events');
    const past = this.dbRead('pastEvents');
    return { upcoming: list, past };
  },

  async registerForEvent(eventId) {
    if (!this.isBackendOffline) {
      try {
        return await this.request('/services/events/register', {
          method: 'POST',
          body: JSON.stringify({ eventId })
        });
      } catch (err) {
        console.warn('Real API failed, doing local simulation:', err.message);
      }
    }

    const user = this.getCurrentUser();
    const events = this.dbRead('events');
    const event = events.find(e => e.id === parseInt(eventId));

    if (!event) throw new Error('Event not found');
    if (event.currentRegistrations >= event.maxCapacity) {
      throw new Error('Event registration is full.');
    }
    if (event.registered) {
      throw new Error('You are already registered for this event.');
    }

    event.registered = true;
    event.currentRegistrations++;
    this.dbWrite('events', events);

    const todaySchedule = this.dbRead('todaySchedule');
    todaySchedule.push({
      time: event.time,
      title: event.title,
      category: 'Events',
      location: event.venue,
      status: 'Upcoming',
      type: 'events',
      icon: 'calendar-days'
    });
    this.dbWrite('todaySchedule', todaySchedule);

    const alerts = this.dbRead('alerts');
    alerts.unshift({
      id: Date.now(),
      type: 'events',
      title: 'Registered: ' + event.title,
      message: `You registered for ${event.title} on ${event.date} at ${event.time}.`,
      time: 'Just now',
      unread: true,
      category: 'Smart Alerts'
    });
    this.dbWrite('alerts', alerts);

    return event;
  },

  // --- SHARED RESOURCES ---
  async getResources() {
    if (!this.isBackendOffline) {
      try {
        return await this.request('/services/resources');
      } catch (err) {}
    }
    return this.dbRead('resources');
  },

  async reserveResource(name, timeSlot) {
    if (!this.isBackendOffline) {
      try {
        // Map name to ID
        const list = await this.request('/services/resources');
        const item = list.find(r => r.name === name);
        if (item) {
          return await this.request('/services/resources/reserve', {
            method: 'POST',
            body: JSON.stringify({ resourceId: item.id, timeSlot })
          });
        }
      } catch (err) {
        console.warn('Real API failed, doing local simulation:', err.message);
      }
    }

    const resources = this.dbRead('resources');
    const res = resources.find(r => r.name === name);
    if (!res) throw new Error('Resource not found');
    if (res.status !== 'AVAILABLE') {
      throw new Error('This facility is currently ' + res.status.toLowerCase());
    }

    res.status = 'RESERVED';
    res.available = false;
    this.dbWrite('resources', resources);

    const reservations = this.dbRead('resourceReservations');
    reservations.unshift({
      id: Date.now(),
      student_id: this.getCurrentUser().id,
      name,
      time: timeSlot
    });
    this.dbWrite('resourceReservations', reservations);

    return res;
  },

  // --- SCHEDULE ---
  async getSchedule(period, filter) {
    if (!this.isBackendOffline) {
      try {
        return await this.request(`/schedule?period=${period}&filter=${filter}`);
      } catch (err) {}
    }
    let items = [];
    if (period === 'today') items = this.dbRead('todaySchedule');
    else if (period === 'tomorrow') items = this.dbRead('tomorrowSchedule');
    else items = [...this.dbRead('todaySchedule'), ...this.dbRead('tomorrowSchedule')];

    if (filter && filter !== 'All') {
      items = items.filter(item => item.type && item.type.toLowerCase() === filter.toLowerCase());
    }
    return items;
  },

  // --- ALERTS & NOTICES ---
  async getAlerts(category) {
    if (!this.isBackendOffline) {
      try {
        return await this.request(`/notifications/alerts?category=${category}`);
      } catch (err) {}
    }
    let alerts = this.dbRead('alerts');
    if (category && category !== 'All') {
      if (category === 'Smart Alerts') {
        alerts = alerts.filter(a => a.category === 'Smart Alerts' || a.type === 'smart');
      } else if (category === 'Notices') {
        alerts = alerts.filter(a => a.category === 'Notices' || a.type === 'notice');
      } else if (category === 'Updates') {
        alerts = alerts.filter(a => a.category === 'Updates' || a.type === 'mess');
      }
    }
    return alerts;
  },

  async markAlertRead(id) {
    if (!this.isBackendOffline) {
      try {
        await this.request(`/notifications/alerts/${id}/read`, { method: 'PUT' });
      } catch (err) {}
    }
    const alerts = this.dbRead('alerts');
    const alert = alerts.find(a => a.id === parseInt(id));
    if (alert) {
      alert.unread = false;
      this.dbWrite('alerts', alerts);
    }
  },

  async getNotices() {
    if (!this.isBackendOffline) {
      try {
        return await this.request('/notifications/notices');
      } catch (err) {}
    }
    return this.dbRead('notices');
  },

  // --- SETTINGS ---
  async getSettings() {
    return {
      dark_mode: SafeStorage.getItem('hh_theme') === 'dark' ? 1 : 0,
      notifications: SafeStorage.getItem('hh_notifications') !== 'false' ? 1 : 0,
      sound: SafeStorage.getItem('hh_sound') !== 'false' ? 1 : 0
    };
  },

  async updateSettings(settings) {
    SafeStorage.setItem('hh_theme', settings.dark_mode ? 'dark' : 'light');
    SafeStorage.setItem('hh_notifications', settings.notifications ? 'true' : 'false');
    SafeStorage.setItem('hh_sound', settings.sound ? 'true' : 'false');
    return { message: 'Settings saved' };
  },

  // --- WARDEN / ADMIN CRUD ACTIONS ---
  async getAdminStats() {
    if (!this.isBackendOffline) {
      try {
        return await this.request('/admin/stats');
      } catch (err) {}
    }
    const students = this.dbRead('students').filter(s => s.role === 'STUDENT');
    const rooms = [...new Set(students.map(s => s.room))];
    const laundry = this.dbRead('laundrySlots');
    const repairs = this.dbRead('repairs');
    const events = this.dbRead('events');
    const notices = this.dbRead('notices');
    const resources = this.dbRead('resources');

    return {
      totalStudents: students.length + 142,
      occupiedRooms: rooms.length + 42,
      laundryBookings: laundry.length,
      openRepairs: repairs.filter(r => r.status !== 'Completed').length,
      upcomingEvents: events.length,
      activeNotices: notices.length,
      resourceUsage: resources.filter(r => r.status !== 'AVAILABLE').length
    };
  },

  async getAllRepairs() {
    if (!this.isBackendOffline) {
      try {
        return await this.request('/services/repair/all');
      } catch (err) {}
    }
    return this.dbRead('repairs');
  },

  async assignRepair(repairId, staffName, priority, dateScheduled) {
    if (!this.isBackendOffline) {
      try {
        return await this.request('/services/repair/assign', {
          method: 'PUT',
          body: JSON.stringify({ repairId, technician: staffName, priority, scheduledTime: dateScheduled })
        });
      } catch (err) {
        console.warn('Real API assign failed, doing local simulation:', err.message);
      }
    }

    const repairs = this.dbRead('repairs');
    const repair = repairs.find(r => r.id === parseInt(repairId));
    if (repair) {
      repair.technician = staffName;
      repair.date = dateScheduled || 'Tomorrow, 2:00 PM – 4:00 PM';
      repair.status = 'Assigned';
      repair.steps = [
        { label: 'Reported', done: true },
        { label: 'Assigned', done: true },
        { label: 'Scheduled', done: false, current: true },
        { label: 'Completed', done: false }
      ];
      this.dbWrite('repairs', repairs);
    }
  },

  async updateMessMenu(meal, itemsString) {
    if (!this.isBackendOffline) {
      try {
        return await this.request('/services/mess/menu', {
          method: 'PUT',
          body: JSON.stringify({ mealType: meal, items: itemsString.split(',').map(i => i.trim()) })
        });
      } catch (err) {
        console.warn('Real API failed, doing local simulation:', err.message);
      }
    }

    const menu = this.dbRead('messMenu');
    if (menu[meal]) {
      menu[meal].items = itemsString.split(',').map(item => item.trim());
      this.dbWrite('messMenu', menu);

      const notices = this.dbRead('notices');
      notices.unshift({
        id: Date.now(),
        title: 'Mess Menu Updated',
        message: `${meal.toUpperCase()} menu has been updated: ${itemsString}`,
        urgent: false,
        date: 'Today'
      });
      this.dbWrite('notices', notices);

      const alerts = this.dbRead('alerts');
      alerts.unshift({
        id: Date.now(),
        type: 'mess',
        title: 'Mess Menu Changed',
        message: `Today's ${meal} items were updated.`,
        time: 'Just now',
        unread: true,
        category: 'Updates'
      });
      this.dbWrite('alerts', alerts);
    }
  },

  async publishNotice(title, message, priority) {
    if (!this.isBackendOffline) {
      try {
        return await this.request('/notifications/notices/new', {
          method: 'POST',
          body: JSON.stringify({ title, message, priority })
        });
      } catch (err) {
        console.warn('Real API notice failed, doing local simulation:', err.message);
      }
    }

    const notices = this.dbRead('notices');
    const newNotice = {
      id: Date.now(),
      title,
      message,
      urgent: priority === 'URGENT',
      date: 'Today'
    };
    notices.unshift(newNotice);
    this.dbWrite('notices', notices);

    const alerts = this.dbRead('alerts');
    alerts.unshift({
      id: Date.now(),
      type: 'notice',
      title: priority === 'URGENT' ? 'Urgent: ' + title : title,
      message,
      time: 'Just now',
      unread: true,
      category: 'Notices'
    });
    this.dbWrite('alerts', alerts);
  },

  async createEvent(title, date, time, venue, capacity) {
    if (!this.isBackendOffline) {
      try {
        return await this.request('/services/events/new', {
          method: 'POST',
          body: JSON.stringify({ title, date, time, venue, maxCapacity: parseInt(capacity) })
        });
      } catch (err) {
        console.warn('Real API event failed, doing local simulation:', err.message);
      }
    }

    const events = this.dbRead('events');
    events.unshift({
      id: Date.now(),
      title,
      date,
      time,
      venue,
      type: 'General',
      status: 'Upcoming',
      registered: false,
      maxCapacity: parseInt(capacity) || 100,
      currentRegistrations: 0
    });
    this.dbWrite('events', events);
  },

  async updateResourceStatus(name, status) {
    if (!this.isBackendOffline) {
      try {
        const list = await this.request('/services/resources');
        const item = list.find(r => r.name === name);
        if (item) {
          return await this.request('/services/resources/status', {
            method: 'PUT',
            body: JSON.stringify({ resourceId: item.id, status })
          });
        }
      } catch (err) {
        console.warn('Real API resource update failed, doing local simulation:', err.message);
      }
    }

    const resources = this.dbRead('resources');
    const res = resources.find(r => r.name === name);
    if (res) {
      res.status = status;
      res.available = status === 'AVAILABLE';
      this.dbWrite('resources', resources);
    }
  },

  // --- STAFF MAINTENANCE ACTIONS ---
  async getStaffRepairs() {
    if (!this.isBackendOffline) {
      try {
        return await this.request('/services/repair/all');
      } catch (err) {}
    }
    return this.dbRead('repairs');
  },

  async updateRepairProgress(repairId, stepIndex, notes) {
    if (!this.isBackendOffline) {
      try {
        const stages = ['Reported', 'Assigned', 'Scheduled', 'Completed'];
        const status = stepIndex === 3 ? 'Completed' : 'In Progress';
        return await this.request('/services/repair/update', {
          method: 'PUT',
          body: JSON.stringify({ repairId, status, notes })
        });
      } catch (err) {
        console.warn('Real API failed, doing local simulation:', err.message);
      }
    }

    const repairs = this.dbRead('repairs');
    const repair = repairs.find(r => r.id === parseInt(repairId));
    if (repair) {
      repair.steps.forEach((step, idx) => {
        if (idx < stepIndex) {
          step.done = true;
          step.current = false;
        } else if (idx === stepIndex) {
          step.done = false;
          step.current = true;
          repair.status = step.label === 'Completed' ? 'Completed' : 'In Progress';
        } else {
          step.done = false;
          step.current = false;
        }
      });

      if (stepIndex === 3) {
        repair.status = 'Completed';
        repair.steps[3].done = true;
        repair.steps[3].current = false;
      }

      this.dbWrite('repairs', repairs);
    }
  }
};

window.ApiService = ApiService;

// Initialize DB and trigger server liveness auto-detection check on load
ApiService.initLocalDB();
ApiService.checkServerLiveness();
