import 'package:flutter/material.dart';
import 'package:hostelhub/widgets/common_widgets.dart' hide OutlinedButton;

import '../mock_data/mock_data.dart';
import '../theme/app_colors.dart';
import '../theme/app_theme.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen(
      {super.key, required this.onOpenDrawer, required this.onOpenAccount});
  final VoidCallback onOpenDrawer;
  final VoidCallback onOpenAccount;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.only(bottom: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              AppHeader(
                title: 'HostelHub',
                subtitle: 'Your hostel, organized.',
                onMenuTap: onOpenDrawer,
                trailingIcon: Icons.notifications_rounded,
                onActionTap: () {},
                showNotificationBadge: true,
              ),
              const SizedBox(height: 8),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Good Morning, Sid 👋',
                      style: AppTheme.lightTheme.textTheme.headlineMedium,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Friday, 14 August 2025',
                      style: AppTheme.lightTheme.textTheme.bodyLarge
                          ?.copyWith(color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 16),
                    const AppCard(
                      padding: EdgeInsets.all(16),
                      child: Row(
                        children: [
                          Icon(Icons.wb_sunny_rounded,
                              color: AppColors.warning),
                          SizedBox(width: 8),
                          Text('29°C · Chennai',
                              style: TextStyle(fontWeight: FontWeight.w500)),
                        ],
                      ),
                    ),
                    const SizedBox(height: 18),
                    Container(
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        color: AppColors.deepNavy,
                        borderRadius: BorderRadius.circular(18),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Block B • Room 304',
                              style: AppTheme.lightTheme.textTheme.titleMedium
                                  ?.copyWith(color: Colors.white)),
                          const SizedBox(height: 6),
                          Text('3rd Floor • 2 Roommates',
                              style: AppTheme.lightTheme.textTheme.bodySmall
                                  ?.copyWith(color: Colors.white70)),
                          const SizedBox(height: 14),
                          Align(
                            alignment: Alignment.centerRight,
                            child: TextButton(
                              onPressed: () {},
                              child: const Text('View Room >',
                                  style: TextStyle(color: Colors.white)),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 22),
                    const SectionHeader(
                        title: 'For You', actionText: 'View All'),
                    const SizedBox(height: 12),
                    ...[
                      const _ForYouRow(
                          title: 'Laundry Slot',
                          subtitle: 'Slot confirmed for tomorrow',
                          color: AppColors.laundryIcon,
                          bg: AppColors.laundryBg),
                      const _ForYouRow(
                          title: 'Repair Scheduled',
                          subtitle: 'Fan repair today at 2 PM',
                          color: AppColors.repairIcon,
                          bg: AppColors.repairBg),
                      const _ForYouRow(
                          title: 'Mess Update',
                          subtitle: 'Dinner menu updated',
                          color: AppColors.messIcon,
                          bg: AppColors.messBg),
                    ].map((row) => Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: row,
                        )),
                    const SizedBox(height: 18),
                    const SectionHeader(
                        title: 'Quick Access', actionText: 'View All'),
                    const SizedBox(height: 12),
                    GridView.count(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisCount: 3,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 0.86,
                      children: MockData.services.map((service) {
                        return ServiceCard(service: service);
                      }).toList(),
                    ),
                    const SizedBox(height: 22),
                    const SectionHeader(
                        title: 'Today\'s Schedule',
                        actionText: 'View Schedule'),
                    const SizedBox(height: 12),
                    ...MockData.todaySchedule.map((item) => Container(
                          margin: const EdgeInsets.only(bottom: 10),
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AppColors.surface,
                            border: Border.all(color: AppColors.border),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 32,
                                height: 32,
                                decoration: BoxDecoration(
                                    color: item.color.withValues(alpha: 0.12),
                                    borderRadius: BorderRadius.circular(10)),
                                child: Icon(Icons.access_time_rounded,
                                    color: item.color, size: 18),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(item.title,
                                        style: AppTheme
                                            .lightTheme.textTheme.titleMedium),
                                    const SizedBox(height: 3),
                                    Text('${item.category} • ${item.location}',
                                        style: AppTheme
                                            .lightTheme.textTheme.bodySmall),
                                  ],
                                ),
                              ),
                              Text(item.time,
                                  style:
                                      AppTheme.lightTheme.textTheme.bodySmall),
                            ],
                          ),
                        )),
                    const SizedBox(height: 22),
                    const SectionHeader(
                        title: 'Today\'s Menu', actionText: 'View'),
                    const SizedBox(height: 12),
                    AppCard(
                      child: Column(
                        children: MockData.menu.map((item) {
                          return Padding(
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            child: Row(
                              children: [
                                Container(
                                  width: 28,
                                  height: 28,
                                  decoration: BoxDecoration(
                                      color: AppColors.messBg,
                                      borderRadius: BorderRadius.circular(8)),
                                  child: const Icon(Icons.restaurant_rounded,
                                      color: AppColors.messIcon, size: 16),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(item.label,
                                          style: AppTheme.lightTheme.textTheme
                                              .titleMedium),
                                      Text(item.value,
                                          style: AppTheme
                                              .lightTheme.textTheme.bodySmall),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                    const SizedBox(height: 22),
                    AppCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Active Repair',
                              style: AppTheme.lightTheme.textTheme.titleMedium),
                          const SizedBox(height: 12),
                          const Row(
                            children: [
                              Text('Reported ✓'),
                              SizedBox(width: 8),
                              Text('Assigned ✓'),
                              SizedBox(width: 8),
                              Text('Scheduled ●'),
                              SizedBox(width: 8),
                              Text('Completed ○'),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 18),
                    AppCard(
                      color: AppColors.errorLight,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Important Notice',
                              style: AppTheme.lightTheme.textTheme.titleMedium),
                          const SizedBox(height: 6),
                          const Text(
                              'Water supply in Block B is being maintained from 12:00 PM to 2:00 PM.'),
                          const SizedBox(height: 8),
                          const Text('View All >',
                              style: TextStyle(
                                  color: AppColors.error,
                                  fontWeight: FontWeight.w600)),
                        ],
                      ),
                    ),
                    const SizedBox(height: 18),
                    AppCard(
                      color: AppColors.eventsBg,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Upcoming Event',
                              style: AppTheme.lightTheme.textTheme.titleMedium),
                          const SizedBox(height: 6),
                          const Text('Hostel Cricket Cup'),
                          const Text('20 Aug, 5:00 PM • Sports Ground'),
                          const SizedBox(height: 8),
                          const Text('View Events >',
                              style: TextStyle(
                                  color: AppColors.eventsIcon,
                                  fontWeight: FontWeight.w600)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ForYouRow extends StatelessWidget {
  const _ForYouRow(
      {required this.title,
      required this.subtitle,
      required this.color,
      required this.bg});
  final String title;
  final String subtitle;
  final Color color;
  final Color bg;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Row(
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
                color: bg, borderRadius: BorderRadius.circular(10)),
            child: Icon(Icons.arrow_forward_rounded, color: color, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: AppTheme.lightTheme.textTheme.titleMedium),
                const SizedBox(height: 3),
                Text(subtitle, style: AppTheme.lightTheme.textTheme.bodySmall),
              ],
            ),
          ),
          const Icon(Icons.chevron_right_rounded,
              color: AppColors.textSecondary),
        ],
      ),
    );
  }
}

class ScheduleScreen extends StatelessWidget {
  const ScheduleScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  IconButton(
                      onPressed: () {}, icon: const Icon(Icons.menu_rounded)),
                  const Expanded(
                      child: Text('Schedule',
                          style: TextStyle(
                              fontSize: 24, fontWeight: FontWeight.w700))),
                  IconButton(
                      onPressed: () {},
                      icon: const Icon(Icons.calendar_today_rounded)),
                ],
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                    color: AppColors.surfaceSoft,
                    borderRadius: BorderRadius.circular(18)),
                child: Row(
                  children: ['Today', 'Tomorrow', 'This Week']
                      .map((tab) => Expanded(
                            child: Container(
                              margin: const EdgeInsets.symmetric(horizontal: 4),
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              decoration: BoxDecoration(
                                color: tab == 'Today'
                                    ? AppColors.primary
                                    : AppColors.surface,
                                borderRadius: BorderRadius.circular(999),
                              ),
                              child: Center(
                                child: Text(tab,
                                    style: TextStyle(
                                        color: tab == 'Today'
                                            ? Colors.white
                                            : AppColors.textPrimary)),
                              ),
                            ),
                          ))
                      .toList(),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Text('Friday, 14 August 2025',
                      style: AppTheme.lightTheme.textTheme.bodyMedium),
                  const Spacer(),
                  const Text('View Calendar >',
                      style: TextStyle(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w600)),
                ],
              ),
              const SizedBox(height: 20),
              ...MockData.todaySchedule.map((item) => Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                        color: AppColors.surface,
                        border: Border.all(color: AppColors.border),
                        borderRadius: BorderRadius.circular(14)),
                    child: Row(
                      children: [
                        Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                                color: item.color, shape: BoxShape.circle)),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(item.title,
                                  style: AppTheme
                                      .lightTheme.textTheme.titleMedium),
                              Text('${item.category} • ${item.location}',
                                  style:
                                      AppTheme.lightTheme.textTheme.bodySmall),
                              const SizedBox(height: 4),
                              Text(item.time,
                                  style:
                                      AppTheme.lightTheme.textTheme.bodySmall),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 5),
                          decoration: BoxDecoration(
                              color: item.color.withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(999)),
                          child: Text(item.status,
                              style: TextStyle(
                                  color: item.color,
                                  fontWeight: FontWeight.w600)),
                        ),
                      ],
                    ),
                  )),
            ],
          ),
        ),
      ),
    );
  }
}

class AlertsScreen extends StatelessWidget {
  const AlertsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  IconButton(
                      onPressed: () {}, icon: const Icon(Icons.menu_rounded)),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Alerts',
                            style: TextStyle(
                                fontSize: 24, fontWeight: FontWeight.w700)),
                        Text('Stay updated with important things',
                            style: TextStyle(color: AppColors.textSecondary)),
                      ],
                    ),
                  ),
                  IconButton(
                      onPressed: () {}, icon: const Icon(Icons.search_rounded)),
                  IconButton(
                      onPressed: () {},
                      icon: const Icon(Icons.filter_list_rounded)),
                ],
              ),
              const SizedBox(height: 16),
              const Text('Unread',
                  style: TextStyle(fontWeight: FontWeight.w700)),
              const SizedBox(height: 12),
              ...MockData.alerts
                  .where((a) => a.unread)
                  .map((alert) => Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                            color: AppColors.surface,
                            border: Border.all(color: AppColors.border),
                            borderRadius: BorderRadius.circular(14)),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              width: 40,
                              height: 40,
                              decoration: BoxDecoration(
                                  color: alert.color.withValues(alpha: 0.12),
                                  borderRadius: BorderRadius.circular(12)),
                              child: Icon(Icons.notifications_active_rounded,
                                  color: alert.color, size: 20),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Expanded(
                                          child: Text(alert.category,
                                              style: TextStyle(
                                                  color: alert.color,
                                                  fontWeight: FontWeight.w700,
                                                  letterSpacing: 0.4))),
                                      Text(alert.time,
                                          style: AppTheme
                                              .lightTheme.textTheme.bodySmall),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(alert.title,
                                      style: AppTheme
                                          .lightTheme.textTheme.titleMedium),
                                  const SizedBox(height: 4),
                                  Text(alert.description,
                                      style: AppTheme
                                          .lightTheme.textTheme.bodySmall),
                                ],
                              ),
                            ),
                            Container(
                                width: 10,
                                height: 10,
                                margin: const EdgeInsets.only(left: 8, top: 8),
                                decoration: BoxDecoration(
                                    color: alert.color,
                                    shape: BoxShape.circle)),
                          ],
                        ),
                      )),
            ],
          ),
        ),
      ),
    );
  }
}

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  IconButton(
                      onPressed: () {}, icon: const Icon(Icons.menu_rounded)),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Profile',
                            style: TextStyle(
                                fontSize: 24, fontWeight: FontWeight.w700)),
                        Text('Manage your account and hostel details',
                            style: TextStyle(color: AppColors.textSecondary)),
                      ],
                    ),
                  ),
                  IconButton(
                      onPressed: () {},
                      icon: const Icon(Icons.notifications_rounded)),
                ],
              ),
              const SizedBox(height: 16),
              AppCard(
                color: AppColors.primaryLight.withValues(alpha: 0.25),
                child: Row(
                  children: [
                    const CircleAvatar(
                        radius: 28,
                        backgroundColor: AppColors.primary,
                        child: Text('S',
                            style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w700))),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Sid',
                              style: TextStyle(
                                  fontWeight: FontWeight.w700, fontSize: 18)),
                          Text('STU1024',
                              style: TextStyle(
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.w600)),
                          Text('Computer Science Engineering'),
                          Text('2024 – 2028 Batch'),
                        ],
                      ),
                    ),
                    OutlinedButton(
                      onPressed: () {},
                      child: const Text('Edit Profile'),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              const Text('Personal Information',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              ...[
                const _InfoRow(
                    label: 'Full Name',
                    value: 'Sid',
                    icon: Icons.person_rounded),
                const _InfoRow(
                    label: 'Email Address',
                    value: 'sid@hostelhub.in',
                    icon: Icons.email_rounded),
                const _InfoRow(
                    label: 'Mobile Number',
                    value: '+91 98765 43210',
                    icon: Icons.phone_rounded),
                const _InfoRow(
                    label: 'Date of Birth',
                    value: '15 Mar 2006',
                    icon: Icons.cake_rounded),
                const _InfoRow(
                    label: 'Blood Group',
                    value: 'O+',
                    icon: Icons.bloodtype_rounded),
              ].map((row) => row),
              const SizedBox(height: 18),
              const Text('Hostel Information',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              AppCard(
                child: GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  mainAxisSpacing: 12,
                  crossAxisSpacing: 12,
                  childAspectRatio: 2.5,
                  children: const [
                    _TinyFact(label: 'Hostel', value: 'Block B'),
                    _TinyFact(label: 'Room Number', value: '304'),
                    _TinyFact(label: 'Floor', value: '3rd Floor'),
                    _TinyFact(label: 'Room Type', value: 'Triple Sharing'),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              const _InfoRow(
                  label: 'View Hostel Details',
                  value: 'Hostel rules, timings, wardens and more',
                  icon: Icons.home_rounded),
            ],
          ),
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow(
      {required this.label, required this.value, required this.icon});
  final String label;
  final String value;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
          color: AppColors.surface,
          border: Border.all(color: AppColors.border),
          borderRadius: BorderRadius.circular(12)),
      child: Row(
        children: [
          Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                  color: AppColors.infoLight,
                  borderRadius: BorderRadius.circular(8)),
              child: Icon(icon, color: AppColors.primary, size: 18)),
          const SizedBox(width: 10),
          Expanded(
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                Text(label, style: AppTheme.lightTheme.textTheme.bodyMedium),
                Text(value, style: AppTheme.lightTheme.textTheme.bodySmall)
              ])),
          const Icon(Icons.chevron_right_rounded,
              color: AppColors.textSecondary),
        ],
      ),
    );
  }
}

class _TinyFact extends StatelessWidget {
  const _TinyFact({required this.label, required this.value});
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: AppColors.surfaceSoft,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: AppTheme.lightTheme.textTheme.bodySmall),
          const SizedBox(height: 4),
          Text(value, style: AppTheme.lightTheme.textTheme.titleMedium),
        ],
      ),
    );
  }
}

class HamburgerDrawer extends StatelessWidget {
  const HamburgerDrawer({super.key, required this.onClose});
  final VoidCallback onClose;

  @override
  Widget build(BuildContext context) {
    return Material(
      child: Container(
        padding: const EdgeInsets.fromLTRB(18, 48, 18, 24),
        color: Colors.white,
        child: Column(
          children: [
            Row(
              children: [
                const Icon(Icons.home_rounded, color: AppColors.primary),
                const SizedBox(width: 8),
                const Expanded(
                    child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                      Text('HostelHub',
                          style: TextStyle(
                              fontWeight: FontWeight.w700, fontSize: 18)),
                      Text('Your hostel, organized.',
                          style: TextStyle(
                              color: AppColors.textSecondary, fontSize: 12))
                    ])),
                IconButton(
                    onPressed: onClose, icon: const Icon(Icons.close_rounded)),
              ],
            ),
            const SizedBox(height: 20),
            const Row(
              children: [
                CircleAvatar(radius: 22, child: Text('S')),
                SizedBox(width: 12),
                Expanded(
                    child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                      Text('Sid',
                          style: TextStyle(fontWeight: FontWeight.w700)),
                      Text('STU1024',
                          style: TextStyle(color: AppColors.primary))
                    ])),
              ],
            ),
            const SizedBox(height: 28),
            ...[
              const _DrawerSection(
                  title: 'ACCOUNT', items: ['My Profile', 'My Hostel Details']),
              const _DrawerSection(
                  title: 'ACTIVITY',
                  items: ['Notifications', 'All Notices', 'My Schedule']),
              const _DrawerSection(
                  title: 'PREFERENCES',
                  items: ['Settings', 'Notification Preferences']),
              const _DrawerSection(title: 'SUPPORT', items: [
                'Help & Support',
                'Report a Problem',
                'About HostelHub'
              ]),
            ],
            const Spacer(),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                  color: AppColors.errorLight,
                  borderRadius: BorderRadius.circular(12)),
              child: const Row(children: [
                Icon(Icons.logout_rounded, color: AppColors.error),
                SizedBox(width: 8),
                Text('Logout',
                    style: TextStyle(
                        color: AppColors.error, fontWeight: FontWeight.w700))
              ]),
            ),
            const SizedBox(height: 12),
            const Text('Version 1.0.0',
                style: TextStyle(color: AppColors.textTertiary)),
          ],
        ),
      ),
    );
  }
}

class _DrawerSection extends StatelessWidget {
  const _DrawerSection({required this.title, required this.items});
  final String title;
  final List<String> items;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(top: 8, bottom: 8),
          child: Text(title,
              style: const TextStyle(
                  color: AppColors.textTertiary,
                  fontWeight: FontWeight.w700,
                  fontSize: 12)),
        ),
        ...items.map((item) => Padding(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Row(
                children: [
                  Container(
                      width: 30,
                      height: 30,
                      decoration: BoxDecoration(
                          color: AppColors.infoLight,
                          borderRadius: BorderRadius.circular(8)),
                      child: const Icon(Icons.arrow_forward_ios_rounded,
                          size: 14, color: AppColors.primary)),
                  const SizedBox(width: 12),
                  Expanded(
                      child: Text(item,
                          style: const TextStyle(fontWeight: FontWeight.w500))),
                  const Icon(Icons.chevron_right_rounded,
                      color: AppColors.textSecondary),
                ],
              ),
            )),
      ],
    );
  }
}

class AccountPanel extends StatelessWidget {
  const AccountPanel({super.key, required this.onClose});
  final VoidCallback onClose;

  @override
  Widget build(BuildContext context) {
    return Material(
      child: Container(
        color: Colors.white,
        padding: const EdgeInsets.fromLTRB(18, 22, 18, 24),
        child: Column(
          children: [
            Row(
              children: [
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('My Account',
                          style: TextStyle(
                              fontSize: 24, fontWeight: FontWeight.w700)),
                      Text('Manage your profile and account',
                          style: TextStyle(color: AppColors.textSecondary)),
                    ],
                  ),
                ),
                IconButton(
                    onPressed: onClose, icon: const Icon(Icons.close_rounded)),
              ],
            ),
            const SizedBox(height: 16),
            const CircleAvatar(radius: 32, child: Text('S')),
            const SizedBox(height: 12),
            const Text('Sid',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
            const Text('STU1024',
                style: TextStyle(
                    color: AppColors.primary, fontWeight: FontWeight.w600)),
            const SizedBox(height: 12),
            const Row(
              children: [
                Expanded(child: _TinyFact(label: 'Hostel', value: 'Block B')),
                SizedBox(width: 8),
                Expanded(child: _TinyFact(label: 'Room Number', value: '304')),
                SizedBox(width: 8),
                Expanded(child: _TinyFact(label: 'Floor', value: '3rd Floor')),
              ],
            ),
            const SizedBox(height: 22),
            ...[
              const _InfoRow(
                  label: 'Edit Profile', value: '', icon: Icons.person_rounded),
              const _InfoRow(
                  label: 'Change Password',
                  value: '',
                  icon: Icons.lock_rounded),
              const _InfoRow(
                  label: 'Linked Email',
                  value: 'sid@hostelhub.in',
                  icon: Icons.email_rounded),
              const _InfoRow(
                  label: 'Mobile Number',
                  value: '+91 98765 43210',
                  icon: Icons.phone_rounded),
              const _InfoRow(
                  label: 'Language',
                  value: 'English',
                  icon: Icons.language_rounded),
            ],
            const SizedBox(height: 18),
            const Text('PREFERENCES',
                style: TextStyle(
                    color: AppColors.textTertiary,
                    fontWeight: FontWeight.w700,
                    fontSize: 12)),
            const SizedBox(height: 8),
            const _InfoRow(
                label: 'Notification Preferences',
                value: '',
                icon: Icons.notifications_rounded),
            const _InfoRow(
                label: 'Theme',
                value: 'System Default',
                icon: Icons.dark_mode_rounded),
            const Spacer(),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                  color: AppColors.errorLight,
                  borderRadius: BorderRadius.circular(12)),
              child: const Row(children: [
                Icon(Icons.logout_rounded, color: AppColors.error),
                SizedBox(width: 8),
                Text('Logout',
                    style: TextStyle(
                        color: AppColors.error, fontWeight: FontWeight.w700))
              ]),
            ),
            const SizedBox(height: 12),
            const Text('Version 1.0.0',
                style: TextStyle(color: AppColors.textTertiary)),
          ],
        ),
      ),
    );
  }
}
