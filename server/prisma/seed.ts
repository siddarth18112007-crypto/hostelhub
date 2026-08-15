import { PrismaClient, Role, ResourceStatus, NoticePriority } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding production database...');

  // 1. Clean existing records
  await prisma.notificationPreference.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.resourceReservation.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.repairUpdate.deleteMany();
  await prisma.repairRequest.deleteMany();
  await prisma.laundryBooking.deleteMany();
  await prisma.laundrySlot.deleteMany();
  await prisma.messMenu.deleteMany();
  await prisma.roomInventory.deleteMany();
  await prisma.room.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.user.deleteMany();

  // 2. Hash Password
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('password123', salt);

  // 3. Create Users
  const student = await prisma.user.create({
    data: {
      email: 'sid@hostelhub.app',
      passwordHash,
      studentId: 'STU1024',
      name: 'Sid',
      role: Role.STUDENT,
      course: 'B.Tech Computer Science',
      batch: '2024–2028',
      block: 'B',
      room: '304',
      floor: '3rd Floor'
    }
  });

  const admin = await prisma.user.create({
    data: {
      email: 'warden@hostelhub.app',
      passwordHash,
      name: 'Dr. Ramesh (Warden)',
      role: Role.ADMIN
    }
  });

  const staff = await prisma.user.create({
    data: {
      email: 'staff@hostelhub.app',
      passwordHash,
      name: 'Arun (Technician)',
      role: Role.STAFF
    }
  });

  console.log('Users seeded: Student, Admin, Staff.');

  // 4. Seeding Room details
  await prisma.room.create({
    data: { number: '304', block: 'B', floor: '3rd Floor', capacity: 3, occupied: 3 }
  });

  // 5. Room Inventory
  const items = ['Bed', 'Study Table', 'Chair', 'Wardrobe', 'Fan', 'Light', 'Power Outlets'];
  for (const item of items) {
    await prisma.roomInventory.create({
      data: { roomNum: '304', item, quantity: 1, status: 'GOOD' }
    });
  }

  // 6. Mess Menus
  const menus = [
    { mealType: 'breakfast', time: '08:00 AM – 09:00 AM', items: ['Idli & Sambar', 'Dosa', 'Bread & Jam', 'Cornflakes', 'Tea / Coffee'] },
    { mealType: 'lunch', time: '12:30 PM – 02:00 PM', items: ['Paneer Butter Masala', 'Roti', 'Rice', 'Dal Tadka'] },
    { mealType: 'snacks', time: '04:30 PM – 05:30 PM', items: ['Samosa', 'Tea / Coffee'] },
    { mealType: 'dinner', time: '07:30 PM – 09:00 PM', items: ['Aloo Gobi', 'Puri', 'Veg Pulao', 'Gulab Jamun'] }
  ];
  for (const m of menus) {
    await prisma.messMenu.create({ data: m });
  }

  // 7. Laundry Slots
  const slot1 = await prisma.laundrySlot.create({
    data: { date: 'Today', time: '02:00 PM – 03:00 PM', machine: 'Machine 3', capacity: 1, occupied: 1 }
  });
  const slot2 = await prisma.laundrySlot.create({
    data: { date: 'Tomorrow', time: '10:00 AM – 11:00 AM', machine: 'Machine 1', capacity: 1, occupied: 1 }
  });

  await prisma.laundryBooking.create({
    data: { userId: student.id, laundrySlotId: slot1.id, status: 'Booked' }
  });
  await prisma.laundryBooking.create({
    data: { userId: student.id, laundrySlotId: slot2.id, status: 'Booked' }
  });

  // 8. Repair Requests
  const repair = await prisma.repairRequest.create({
    data: {
      userId: student.id,
      issue: 'AC Not Cooling',
      room: 'Room 304',
      technician: 'Arun',
      status: 'Scheduled',
      scheduledTime: 'Tomorrow, 2:00 PM – 4:00 PM'
    }
  });

  await prisma.repairUpdate.create({
    data: { repairRequestId: repair.id, status: 'Reported', notes: 'Ticket logged' }
  });
  await prisma.repairUpdate.create({
    data: { repairRequestId: repair.id, status: 'Assigned', notes: 'Arun assigned' }
  });
  await prisma.repairUpdate.create({
    data: { repairRequestId: repair.id, status: 'Scheduled', notes: 'Scheduled for tomorrow 2-4 PM' }
  });

  // 9. Events
  await prisma.event.create({
    data: {
      title: 'Hostel Cricket Cup',
      date: '20 Aug',
      time: '5:00 PM',
      venue: 'Ground 2',
      type: 'Sports',
      status: 'Upcoming',
      maxCapacity: 100,
      currentCount: 42,
      deadline: '19 Aug'
    }
  });

  await prisma.event.create({
    data: {
      title: 'Movie Night',
      date: '22 Aug',
      time: '7:00 PM',
      venue: 'Common Room',
      type: 'Entertainment',
      status: 'Upcoming',
      maxCapacity: 50,
      currentCount: 15,
      deadline: '21 Aug'
    }
  });

  // 10. Shared Resources
  const resources = [
    { name: 'Study Room', category: 'Study', description: 'Open 24/7', location: 'Block B, 1st Floor', status: ResourceStatus.AVAILABLE },
    { name: 'Gym', category: 'Fitness', description: '6 AM – 10 PM', location: 'Ground Floor', status: ResourceStatus.AVAILABLE },
    { name: 'Common Room', category: 'Leisure', description: 'TV, Games', location: 'Block A, 1st Floor', status: ResourceStatus.AVAILABLE }
  ];
  for (const r of resources) {
    await prisma.resource.create({ data: r });
  }

  // 11. Broadcast Notices
  await prisma.notice.create({
    data: {
      title: 'Important Notice',
      message: 'Water supply will be interrupted tomorrow from 9:00 AM to 11:00 AM.',
      priority: NoticePriority.URGENT,
      publishedDate: '14 Aug'
    }
  });

  // 12. Alert notifications
  await prisma.alert.create({
    data: {
      userId: student.id,
      type: 'smart',
      title: 'Security Update',
      message: 'New visitor entry rules starting Monday, 17 Aug. Please check...',
      time: '10:45 AM',
      unread: true,
      category: 'Smart Alerts'
    }
  });

  await prisma.alert.create({
    data: {
      userId: student.id,
      type: 'mess',
      title: 'Special Dinner Tonight',
      message: 'Paneer Butter Masala served at 7:30 PM in Main Mess.',
      time: '09:00 AM',
      unread: true,
      category: 'Updates'
    }
  });

  // 13. Default preferences
  await prisma.notificationPreference.create({
    data: {
      userId: student.id,
      messUpdates: true,
      laundryReminders: true,
      repairUpdates: true,
      eventReminders: true,
      notices: true,
      smartAlerts: true
    }
  });

  console.log('Database seeding complete successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
