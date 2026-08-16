const SafeStorage = {
  isSupported: (() => {
    try {
      localStorage.setItem('hh_test_storage', '1');
      localStorage.removeItem('hh_test_storage');
      return true;
    } catch (e) {
      return false;
    }
  })(),
  memory: {},

  getItem(key) {
    if (this.isSupported) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    }
    return this.memory[key] || null;
  },

  setItem(key, value) {
    if (this.isSupported) {
      try {
        localStorage.setItem(key, value);
        return;
      } catch (e) {}
    }
    this.memory[key] = value;
  },

  removeItem(key) {
    if (this.isSupported) {
      try {
        localStorage.removeItem(key);
        return;
      } catch (e) {}
    }
    delete this.memory[key];
  }
};

const AppData = {
  student: {
    name: 'Sid',
    id: 'STU1024',
    course: 'B.Tech Computer Science',
    batch: '2024–2028',
    block: 'B',
    room: '304',
    floor: '3rd Floor',
    roommates: 2,
    avatar: null
  },
  
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
    issue: 'AC Not Cooling',
    room: 'Req #1042',
    date: 'Logged Yesterday',
    technician: 'Arun',
    steps: [
      { label: 'Reported', done: true },
      { label: 'Assigned', done: true },
      { label: 'Scheduled', done: false, current: true },
      { label: 'Completed', done: false }
    ]
  },
  
  notice: {
    title: 'Important Notice',
    message: 'Water supply will be interrupted tomorrow from 9:00 AM to 11:00 AM.',
    urgent: true
  },
  
  upcomingEvent: {
    title: 'Hostel Cricket Cup',
    name: 'Hostel Cricket Cup',
    date: '20 Aug',
    time: '5:00 PM',
    venue: 'Ground 2'
  },
  
  alerts: [
    { id: 1, type: 'smart', title: 'Security Update', message: 'New visitor entry rules starting Monday, 17 Aug. Please check...', time: '10:45 AM', unread: true, category: 'Smart Alerts' },
    { id: 2, type: 'mess', title: 'Special Dinner Tonight', message: 'Paneer Butter Masala served at 7:30 PM in Main Mess.', time: '09:00 AM', unread: true, category: 'Updates' },
    { id: 3, type: 'notice', title: 'Water Shutdown', message: 'Maintenance in Block B from 2:00 PM to 4:00 PM.', time: '13 Aug', unread: false, category: 'Notices' },
    { id: 4, type: 'events', title: 'Hostel Cricket Cup', message: 'Match rescheduled to 20 Aug, 5:00 PM at the main ground.', time: '12 Aug', unread: false, category: 'Smart Alerts' }
  ],
  
  repairHistory: [
    { issue: 'Light flickering', room: 'Room 304', date: '10 Aug', status: 'Completed', technician: 'Ravi' },
    { issue: 'Door lock issue', room: 'Room 304', date: '5 Aug', status: 'Completed', technician: 'Kumar' }
  ],
  
  laundrySlots: [
    { date: 'Today', time: '02:00 PM – 03:00 PM', machine: 'Machine 3', status: 'Booked' },
    { date: 'Tomorrow', time: '10:00 AM – 11:00 AM', machine: 'Machine 1', status: 'Booked' }
  ],
  
  laundryHistory: [
    { date: '12 Aug', time: '10:00 AM', machine: 'Machine 2', status: 'Completed' },
    { date: '8 Aug', time: '03:00 PM', machine: 'Machine 3', status: 'Completed' }
  ],
  
  events: [
    { title: 'Hostel Cricket Cup', date: '20 Aug', time: '5:00 PM', venue: 'Ground 2', type: 'Sports', status: 'Upcoming' },
    { title: 'Movie Night', date: '22 Aug', time: '7:00 PM', venue: 'Common Room', type: 'Entertainment', status: 'Upcoming' },
    { title: 'Chess Tournament', date: '25 Aug', time: '4:00 PM', venue: 'Recreation Hall', type: 'Sports', status: 'Upcoming' }
  ],
  
  pastEvents: [
    { title: "Fresher's Welcome", date: '1 Aug', time: '6:00 PM', venue: 'Main Hall', type: 'Cultural', status: 'Completed' },
    { title: 'Coding Bootcamp', date: '28 Jul', time: '10:00 AM', venue: 'Lab 3', type: 'Academic', status: 'Completed' }
  ],
  
  roomAmenities: ['Bed', 'Study Table', 'Chair', 'Wardrobe', 'Fan', 'Light', 'Power Outlets'],
  
  roommates: [
    { name: 'Arjun', id: 'STU1025' },
    { name: 'Karthik', id: 'STU1026' }
  ],
  
  resources: [
    { name: 'Study Room', desc: 'Open 24/7', icon: 'book-open', available: true },
    { name: 'Gym', desc: '6 AM – 10 PM', icon: 'dumbbell', available: true },
    { name: 'Common Room', desc: 'TV, Games', icon: 'tv', available: true },
    { name: 'WiFi', desc: 'HostelNet', icon: 'wifi', available: true },
    { name: 'Parking', desc: 'Basement B1', icon: 'car', available: true },
    { name: 'Medical Room', desc: '9 AM – 5 PM', icon: 'heart-pulse', available: true }
  ],
  
  drawerMenu: {
    account: [
      { label: 'My Profile', icon: 'user', page: 'profile' },
      { label: 'My Room', icon: 'bed-double', page: 'room' }
    ],
    activity: [
      { label: 'Alerts & Notices', icon: 'bell', page: 'alerts' },
      { label: 'My Schedule', icon: 'calendar', page: 'schedule' }
    ],
    preferences: [
      { label: 'Settings', icon: 'settings', page: 'settings' },
      { label: 'Notification Preferences', icon: 'sliders-horizontal', page: 'notification-prefs' }
    ],
    support: [
      { label: 'Help & Support', icon: 'help-circle', page: 'help' },
      { label: 'Report a Problem', icon: 'flag', page: 'report' },
      { label: 'About HostelHub', icon: 'info', page: 'about' }
    ]
  }
};

window.SafeStorage = SafeStorage;
window.AppData = AppData;
