import '../theme/app_colors.dart';
import 'package:flutter/material.dart';

class Student {
  final String name;
  final String id;
  final String block;
  final String room;
  final String floor;
  final int roommates;
  final String course;
  final String batch;

  const Student({
    required this.name,
    required this.id,
    required this.block,
    required this.room,
    required this.floor,
    required this.roommates,
    required this.course,
    required this.batch,
  });
}

class Roommate {
  final String name;
  final String id;

  const Roommate({required this.name, required this.id});
}

class ScheduleItem {
  final String title;
  final String category;
  final String location;
  final String time;
  final Color color;
  final String status;

  const ScheduleItem({
    required this.title,
    required this.category,
    required this.location,
    required this.time,
    required this.color,
    required this.status,
  });
}

class AlertItem {
  final String title;
  final String description;
  final String category;
  final String time;
  final String date;
  final String location;
  final bool unread;
  final Color color;

  const AlertItem({
    required this.title,
    required this.description,
    required this.category,
    required this.time,
    required this.date,
    required this.location,
    required this.unread,
    required this.color,
  });
}

class MessMenuItem {
  final String label;
  final String value;

  const MessMenuItem({required this.label, required this.value});
}

class HostelService {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final Color backgroundColor;

  const HostelService({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
    required this.backgroundColor,
  });
}

class MockData {
  static const Student student = Student(
    name: 'Sid',
    id: 'STU1024',
    block: 'B',
    room: '304',
    floor: '3rd Floor',
    roommates: 2,
    course: 'Computer Science Engineering',
    batch: '2024 – 2028',
  );

  static const List<Roommate> roommates = [
    Roommate(name: 'Arjun', id: 'STU1005'),
    Roommate(name: 'Meera', id: 'STU1218'),
  ];

  static const List<ScheduleItem> todaySchedule = [
    ScheduleItem(
      title: 'Breakfast',
      category: 'Mess',
      location: 'Dining Hall',
      time: '08:00 AM - 09:00 AM',
      color: AppColors.messIcon,
      status: 'On Time',
    ),
    ScheduleItem(
      title: 'Laundry Slot',
      category: 'Laundry',
      location: 'Ground Floor',
      time: '10:00 AM - 11:00 AM',
      color: AppColors.laundryIcon,
      status: 'Booked',
    ),
    ScheduleItem(
      title: 'Badminton',
      category: 'Events',
      location: 'Sports Court',
      time: '05:30 PM - 07:00 PM',
      color: AppColors.eventsIcon,
      status: 'Upcoming',
    ),
  ];

  static const List<AlertItem> alerts = [
    AlertItem(
      title: 'Laundry slot reminder',
      description:
          'Your slot is at 10:00 AM today. Please confirm before the timer ends.',
      category: 'SMART ALERT',
      time: '09:15 AM',
      date: 'Today',
      location: 'Ground Floor',
      unread: true,
      color: AppColors.primary,
    ),
    AlertItem(
      title: 'Dinner menu updated',
      description:
          'Dinner has a new special menu for tonight. Check the updated items.',
      category: 'MESS UPDATE',
      time: '08:45 AM',
      date: 'Today',
      location: 'Mess',
      unread: true,
      color: AppColors.messIcon,
    ),
    AlertItem(
      title: 'Hostel notice',
      description:
          'Water supply in Block B is scheduled for maintenance from 12:00 PM.',
      category: 'NOTICE',
      time: 'Yesterday',
      date: '13 Aug',
      location: 'Block B',
      unread: false,
      color: AppColors.repairIcon,
    ),
  ];

  static const List<MessMenuItem> menu = [
    MessMenuItem(label: 'Breakfast', value: 'Idli, Sambar, Chutney, Banana'),
    MessMenuItem(label: 'Lunch', value: 'Rice, Sambar, Paneer curry, Salad'),
    MessMenuItem(label: 'Snacks', value: 'Tea, Sandwich, Fruit cup'),
    MessMenuItem(label: 'Dinner', value: 'Chapathi, Dal, Veg curry, Curd'),
  ];

  static const List<HostelService> services = [
    HostelService(
        title: 'Room',
        subtitle: 'Your room details',
        icon: Icons.bed_rounded,
        color: AppColors.roomIcon,
        backgroundColor: AppColors.roomBg),
    HostelService(
        title: 'Mess',
        subtitle: 'Meal updates',
        icon: Icons.restaurant_rounded,
        color: AppColors.messIcon,
        backgroundColor: AppColors.messBg),
    HostelService(
        title: 'Laundry',
        subtitle: 'Slots & bookings',
        icon: Icons.local_laundry_service_rounded,
        color: AppColors.laundryIcon,
        backgroundColor: AppColors.laundryBg),
    HostelService(
        title: 'Repair',
        subtitle: 'Maintenance',
        icon: Icons.build_rounded,
        color: AppColors.repairIcon,
        backgroundColor: AppColors.repairBg),
    HostelService(
        title: 'Events',
        subtitle: 'Campus buzz',
        icon: Icons.event_rounded,
        color: AppColors.eventsIcon,
        backgroundColor: AppColors.eventsBg),
    HostelService(
        title: 'Resources',
        subtitle: 'Campus access',
        icon: Icons.folder_rounded,
        color: AppColors.resourcesIcon,
        backgroundColor: AppColors.resourcesBg),
  ];
}
