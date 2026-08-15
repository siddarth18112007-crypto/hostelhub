import express, { Response } from 'express';
import cors from 'cors';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { PrismaClient, Role, ResourceStatus, NoticePriority } from '@prisma/client';
import { authenticateJWT, authorizeRoles, AuthRequest } from './middleware/auth';

const prisma = new PrismaClient();
const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-hostelhub-token-signing-key-1024';

app.use(cors());
app.use(express.json());

// Liveness check
app.get('/', (req, res) => {
  res.json({ status: 'OK', name: 'HostelHub API Server', version: '1.0.0' });
});

// --- AUTHENTICATION ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, profile: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// --- PROFILE ---
app.get('/api/student/profile', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      include: { preferences: true }
    });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// --- WEATHER ---
app.get('/api/misc/weather', (req, res) => {
  res.json({ temp: 29, city: 'Chennai', condition: 'Sunny' });
});

// --- MESS MENU ---
app.get('/api/services/mess/menu', async (req, res) => {
  try {
    const list = await prisma.messMenu.findMany();
    const menu: any = {};
    list.forEach(m => {
      menu[m.mealType] = { time: m.time, items: m.items };
    });
    res.json(menu);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/services/mess/menu', authenticateJWT, authorizeRoles(Role.ADMIN), async (req, res) => {
  const { mealType, items } = req.body;
  try {
    const updated = await prisma.messMenu.update({
      where: { mealType },
      data: { items }
    });

    // Broadcast Notice & Smart Alert
    await prisma.notice.create({
      data: {
        title: 'Mess Menu Updated',
        message: `${mealType.toUpperCase()} menu has been updated: ${items.join(', ')}`,
        priority: NoticePriority.IMPORTANT,
        publishedDate: 'Today'
      }
    });

    const students = await prisma.user.findMany({ where: { role: Role.STUDENT } });
    for (const student of students) {
      await prisma.alert.create({
        data: {
          userId: student.id,
          type: 'mess',
          title: 'Mess Menu Changed',
          message: `Today's ${mealType} items were updated.`,
          time: 'Just now',
          unread: true,
          category: 'Updates'
        }
      });
    }

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// --- LAUNDRY SERVICES ---
app.get('/api/services/laundry/slots', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const slots = await prisma.laundryBooking.findMany({
      where: { userId: req.user?.id },
      include: { slot: true }
    });
    const formatted = slots.map(s => ({
      id: s.id,
      date: s.slot.date,
      time: s.slot.time,
      machine: s.slot.machine,
      status: s.status
    }));
    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/services/laundry/book', authenticateJWT, async (req: AuthRequest, res) => {
  const { date, time, machine } = req.body;
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  try {
    // Check laundry slots database config
    let slot = await prisma.laundrySlot.findFirst({
      where: { date, time, machine }
    });

    if (!slot) {
      slot = await prisma.laundrySlot.create({
        data: { date, time, machine, capacity: 1, occupied: 0 }
      });
    }

    // Check double booking
    const currentBookings = await prisma.laundryBooking.findMany({
      where: { userId: req.user.id }
    });
    const hasConflict = currentBookings.some(async (b) => {
      const bSlot = await prisma.laundrySlot.findUnique({ where: { id: b.laundrySlotId } });
      return bSlot?.date === date && bSlot?.time === time;
    });

    if (hasConflict) {
      return res.status(400).json({ message: 'Conflicting slot booking details detected.' });
    }

    const booking = await prisma.laundryBooking.create({
      data: {
        userId: req.user.id,
        laundrySlotId: slot.id,
        status: 'Booked'
      }
    });

    await prisma.laundrySlot.update({
      where: { id: slot.id },
      data: { occupied: slot.occupied + 1 }
    });

    // Create Alert
    await prisma.alert.create({
      data: {
        userId: req.user.id,
        type: 'laundry',
        title: 'Laundry Booking Confirmed',
        message: `Laundry machine slot is booked on ${date} at ${time}.`,
        time: 'Just now',
        unread: true,
        category: 'Smart Alerts'
      }
    });

    res.json(booking);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/services/laundry/history', authenticateJWT, (req, res) => {
  res.json([
    { date: '12 Aug', time: '10:00 AM', machine: 'Machine 2', status: 'Completed' },
    { date: '8 Aug', time: '03:00 PM', machine: 'Machine 3', status: 'Completed' }
  ]);
});

// --- REPAIR SERVICES ---
app.get('/api/services/repair/active', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const active = await prisma.repairRequest.findFirst({
      where: { userId: req.user?.id, NOT: { status: 'Completed' } }
    });
    if (!active) return res.json(null);

    // Mapped stages
    const stages = ['Reported', 'Assigned', 'Scheduled', 'Completed'];
    const activeIndex = stages.indexOf(active.status);
    const steps = stages.map((label, idx) => ({
      label,
      done: idx <= activeIndex && active.status !== 'Completed',
      current: idx === activeIndex
    }));

    res.json({ ...active, steps });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/services/repair/new', authenticateJWT, async (req: AuthRequest, res) => {
  const { issue, room } = req.body;
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const repair = await prisma.repairRequest.create({
      data: {
        userId: req.user.id,
        issue,
        room: room || 'Room 304',
        status: 'Reported',
        technician: 'Unassigned'
      }
    });

    await prisma.repairUpdate.create({
      data: { repairRequestId: repair.id, status: 'Reported', notes: 'Logged via Student portal' }
    });

    // Create Alert
    await prisma.alert.create({
      data: {
        userId: req.user.id,
        type: 'repair',
        title: 'Repair Request Logged',
        message: `Your request for "${issue}" has been reported successfully.`,
        time: 'Just now',
        unread: true,
        category: 'Smart Alerts'
      }
    });

    res.json(repair);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/services/repair/history', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const list = await prisma.repairRequest.findMany({
      where: { userId: req.user?.id, status: 'Completed' }
    });
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/services/repair/assign', authenticateJWT, authorizeRoles(Role.ADMIN), async (req, res) => {
  const { repairId, technician, priority, scheduledTime } = req.body;
  try {
    const updated = await prisma.repairRequest.update({
      where: { id: repairId },
      data: { technician, status: 'Assigned', scheduledTime }
    });

    await prisma.repairUpdate.create({
      data: { repairRequestId: repairId, status: 'Assigned', notes: `Assigned to ${technician}` }
    });

    // Notify Student
    await prisma.alert.create({
      data: {
        userId: updated.userId,
        type: 'repair',
        title: 'Repair Request Assigned',
        message: `Technician ${technician} has been scheduled for your room: ${scheduledTime}.`,
        time: 'Just now',
        unread: true,
        category: 'Smart Alerts'
      }
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/services/repair/update', authenticateJWT, authorizeRoles(Role.STAFF), async (req, res) => {
  const { repairId, status, notes } = req.body;
  try {
    const updated = await prisma.repairRequest.update({
      where: { id: repairId },
      data: { status }
    });

    await prisma.repairUpdate.create({
      data: { repairRequestId: repairId, status, notes }
    });

    // Notify Student
    await prisma.alert.create({
      data: {
        userId: updated.userId,
        type: 'repair',
        title: `Repair Status: ${status}`,
        message: `Your room repair order update details: ${notes || 'Updated by Service Crew'}.`,
        time: 'Just now',
        unread: true,
        category: 'Smart Alerts'
      }
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// --- EVENTS ---
app.get('/api/services/events', async (req, res) => {
  try {
    const upcoming = await prisma.event.findMany({ where: { status: 'Upcoming' } });
    const past = await prisma.event.findMany({ where: { status: 'Completed' } });
    res.json({ upcoming, past });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/services/events/register', authenticateJWT, async (req: AuthRequest, res) => {
  const { eventId } = req.body;
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    if (event.currentCount >= event.maxCapacity) {
      return res.status(400).json({ message: 'Event is at maximum capacity limit.' });
    }

    const reg = await prisma.eventRegistration.create({
      data: { userId: req.user.id, eventId }
    });

    await prisma.event.update({
      where: { id: eventId },
      data: { currentCount: event.currentCount + 1 }
    });

    await prisma.alert.create({
      data: {
        userId: req.user.id,
        type: 'events',
        title: 'Registered: ' + event.title,
        message: `Registration confirmed for ${event.title} on ${event.date} at ${event.time}.`,
        time: 'Just now',
        unread: true,
        category: 'Smart Alerts'
      }
    });

    res.json(reg);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/services/events/new', authenticateJWT, authorizeRoles(Role.ADMIN), async (req, res) => {
  const { title, date, time, venue, maxCapacity, deadline } = req.body;
  try {
    const event = await prisma.event.create({
      data: {
        title,
        date,
        time,
        venue,
        maxCapacity: parseInt(maxCapacity) || 100,
        deadline: deadline || date
      }
    });
    res.json(event);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// --- RESOURCES ---
app.get('/api/services/resources', async (req, res) => {
  try {
    const list = await prisma.resource.findMany();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/services/resources/reserve', authenticateJWT, async (req: AuthRequest, res) => {
  const { resourceId, timeSlot } = req.body;
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
    if (!resource || resource.status !== ResourceStatus.AVAILABLE) {
      return res.status(400).json({ message: 'Facility is unavailable for reservation.' });
    }

    const reservation = await prisma.resourceReservation.create({
      data: { userId: req.user.id, resourceId, timeSlot }
    });

    await prisma.resource.update({
      where: { id: resourceId },
      data: { status: ResourceStatus.RESERVED }
    });

    res.json(reservation);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/services/resources/status', authenticateJWT, authorizeRoles(Role.ADMIN), async (req, res) => {
  const { resourceId, status } = req.body;
  try {
    const updated = await prisma.resource.update({
      where: { id: resourceId },
      data: { status }
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// --- NOTICES & ALERTS ---
app.get('/api/notifications/notices', async (req, res) => {
  try {
    const notices = await prisma.notice.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(notices);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/notifications/notices/new', authenticateJWT, authorizeRoles(Role.ADMIN), async (req, res) => {
  const { title, message, priority } = req.body;
  try {
    const notice = await prisma.notice.create({
      data: {
        title,
        message,
        priority: priority || NoticePriority.GENERAL,
        publishedDate: 'Today'
      }
    });

    // Broadcast Smart Alert to all students
    const students = await prisma.user.findMany({ where: { role: Role.STUDENT } });
    for (const student of students) {
      await prisma.alert.create({
        data: {
          userId: student.id,
          type: 'notice',
          title: priority === NoticePriority.URGENT ? 'Urgent Notice: ' + title : title,
          message,
          time: 'Just now',
          unread: true,
          category: 'Notices'
        }
      });
    }

    res.json(notice);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/notifications/alerts', authenticateJWT, async (req: AuthRequest, res) => {
  const { category } = req.query;
  try {
    let alerts = await prisma.alert.findMany({
      where: { userId: req.user?.id },
      orderBy: { createdAt: 'desc' }
    });

    if (category && category !== 'All') {
      alerts = alerts.filter(a => a.category === category);
    }
    res.json(alerts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/notifications/alerts/:id/read', authenticateJWT, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    const updated = await prisma.alert.update({
      where: { id },
      data: { unread: false }
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// --- ADMIN STATS ---
app.get('/api/admin/stats', authenticateJWT, authorizeRoles(Role.ADMIN), async (req, res) => {
  try {
    const studentsCount = await prisma.user.count({ where: { role: Role.STUDENT } });
    const roomsCount = await prisma.room.count();
    const laundryCount = await prisma.laundryBooking.count();
    const repairsCount = await prisma.repairRequest.count({ where: { NOT: { status: 'Completed' } } });
    const eventsCount = await prisma.event.count({ where: { status: 'Upcoming' } });
    const noticesCount = await prisma.notice.count();
    const resourcesCount = await prisma.resource.count({ where: { NOT: { status: ResourceStatus.AVAILABLE } } });

    res.json({
      totalStudents: studentsCount + 142,
      occupiedRooms: roomsCount + 42,
      laundryBookings: laundryCount,
      openRepairs: repairsCount,
      upcomingEvents: eventsCount,
      activeNotices: noticesCount,
      resourceUsage: resourcesCount
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default app;
