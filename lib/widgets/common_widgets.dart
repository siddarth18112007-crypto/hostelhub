import 'package:flutter/material.dart';

import '../mock_data/mock_data.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import '../theme/app_theme.dart';

class PrimaryButton extends StatelessWidget {
  const PrimaryButton(
      {super.key, required this.label, required this.onPressed, this.width});
  final String label;
  final VoidCallback onPressed;
  final double? width;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      height: 48,
      child: ElevatedButton(
        onPressed: onPressed,
        style: AppTheme.lightTheme.elevatedButtonTheme.style,
        child: Text(label),
      ),
    );
  }
}

class OutlinedButton extends StatelessWidget {
  const OutlinedButton(
      {super.key, required this.label, required this.onPressed});
  final String label;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 48,
      child: TextButton(
        onPressed: onPressed,
        style: AppTheme.lightTheme.outlinedButtonTheme.style?.copyWith(
          padding: WidgetStateProperty.all(
            const EdgeInsets.symmetric(horizontal: AppSpacing.xl),
          ),
          side: WidgetStateProperty.all(
            const BorderSide(color: AppColors.primary),
          ),
          shape: WidgetStateProperty.all(
            RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppRadius.button),
            ),
          ),
        ),
        child: Text(label),
      ),
    );
  }
}

class AppTextField extends StatelessWidget {
  const AppTextField(
      {super.key,
      required this.label,
      required this.controller,
      this.obscureText = false});
  final String label;
  final TextEditingController controller;
  final bool obscureText;

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      obscureText: obscureText,
      decoration: InputDecoration(
        hintText: label,
        hintStyle: const TextStyle(color: AppColors.textTertiary),
      ),
    );
  }
}

class AppCard extends StatelessWidget {
  const AppCard(
      {super.key,
      required this.child,
      this.padding = const EdgeInsets.all(AppSpacing.lg),
      this.color = AppColors.surface,
      this.borderColor = AppColors.border,
      this.borderRadius = AppRadius.card,
      this.margin = EdgeInsets.zero,
      this.shadow = false});
  final Widget child;
  final EdgeInsets padding;
  final Color color;
  final Color borderColor;
  final double borderRadius;
  final EdgeInsets margin;
  final bool shadow;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: margin,
      padding: padding,
      decoration: BoxDecoration(
        color: color,
        border: Border.all(color: borderColor, width: 1),
        borderRadius: BorderRadius.circular(borderRadius),
        boxShadow: shadow
            ? [
                BoxShadow(
                    color: AppColors.border.withValues(alpha: 0.18),
                    blurRadius: 10,
                    offset: const Offset(0, 2))
              ]
            : null,
      ),
      child: child,
    );
  }
}

class SectionHeader extends StatelessWidget {
  const SectionHeader(
      {super.key,
      required this.title,
      this.actionText,
      this.actionColor = AppColors.primary});
  final String title;
  final String? actionText;
  final Color actionColor;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Text(
            title,
            style: AppTheme.lightTheme.textTheme.titleLarge,
          ),
        ),
        if (actionText != null)
          Text(
            actionText!,
            style: AppTheme.lightTheme.textTheme.bodyMedium
                ?.copyWith(color: actionColor),
          ),
      ],
    );
  }
}

class AppBottomNavigation extends StatelessWidget {
  const AppBottomNavigation(
      {super.key,
      required this.currentIndex,
      required this.onTap,
      this.unreadAlerts = 0});
  final int currentIndex;
  final ValueChanged<int> onTap;
  final int unreadAlerts;

  @override
  Widget build(BuildContext context) {
    final items = [
      const _NavItem(icon: Icons.home_rounded, label: 'Home'),
      const _NavItem(icon: Icons.calendar_month_rounded, label: 'Schedule'),
      const _NavItem(icon: Icons.notifications_rounded, label: 'Alerts'),
      const _NavItem(icon: Icons.person_rounded, label: 'Profile'),
    ];

    return SafeArea(
      child: Container(
        decoration: const BoxDecoration(
          color: AppColors.surface,
          border: Border(top: BorderSide(color: AppColors.border)),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          child: Row(
            children: List.generate(items.length, (index) {
              final item = items[index];
              final active = index == currentIndex;
              return Expanded(
                child: GestureDetector(
                  onTap: () => onTap(index),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Stack(
                      alignment: Alignment.topCenter,
                      children: [
                        Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(item.icon,
                                color: active
                                    ? AppColors.primary
                                    : AppColors.textTertiary,
                                size: 24),
                            const SizedBox(height: 4),
                            Text(
                              item.label,
                              style: AppTheme.lightTheme.textTheme.bodySmall
                                  ?.copyWith(
                                color: active
                                    ? AppColors.primary
                                    : AppColors.textTertiary,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                        if (index == 2 && unreadAlerts > 0)
                          Positioned(
                            right: 18,
                            top: 0,
                            child: NotificationBadge(count: unreadAlerts),
                          ),
                      ],
                    ),
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}

class NotificationBadge extends StatelessWidget {
  const NotificationBadge({super.key, required this.count});
  final int count;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 18,
      height: 18,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: AppColors.error,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        count > 9 ? '9+' : '$count',
        style: const TextStyle(
            fontSize: 10, color: Colors.white, fontWeight: FontWeight.w700),
      ),
    );
  }
}

class ServiceCard extends StatelessWidget {
  final HostelService service;
  final VoidCallback? onTap;

  const ServiceCard({
    super.key,
    required this.service,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(AppRadius.card),
      onTap: onTap ?? () {},
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          border: Border.all(color: AppColors.border),
          borderRadius: BorderRadius.circular(AppRadius.card),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: service.backgroundColor,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(service.icon, color: service.color),
            ),
            const SizedBox(height: 14),
            Text(service.title,
                style: AppTheme.lightTheme.textTheme.titleMedium),
            const SizedBox(height: 4),
            Text(service.subtitle,
                style: AppTheme.lightTheme.textTheme.bodySmall),
          ],
        ),
      ),
    );
  }
}

class AppHeader extends StatelessWidget {
  const AppHeader(
      {super.key,
      required this.title,
      this.subtitle,
      this.onMenuTap,
      this.onActionTap,
      this.trailingIcon,
      this.showNotificationBadge = false});
  final String title;
  final String? subtitle;
  final VoidCallback? onMenuTap;
  final VoidCallback? onActionTap;
  final IconData? trailingIcon;
  final bool showNotificationBadge;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
      child: Row(
        children: [
          if (onMenuTap != null)
            IconButton(
                onPressed: onMenuTap, icon: const Icon(Icons.menu_rounded)),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: AppTheme.lightTheme.textTheme.headlineMedium),
                if (subtitle != null)
                  Text(subtitle!,
                      style: AppTheme.lightTheme.textTheme.bodySmall),
              ],
            ),
          ),
          if (trailingIcon != null)
            Stack(
              children: [
                IconButton(onPressed: onActionTap, icon: Icon(trailingIcon)),
                if (showNotificationBadge)
                  const Positioned(
                      right: 10, top: 10, child: NotificationBadge(count: 3)),
              ],
            ),
        ],
      ),
    );
  }
}

class _NavItem {
  const _NavItem({required this.icon, required this.label});
  final IconData icon;
  final String label;
}
