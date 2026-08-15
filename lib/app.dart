import 'package:flutter/material.dart';
import 'package:hostelhub/widgets/common_widgets.dart' hide OutlinedButton;
import 'package:hostelhub/theme/app_colors.dart';
import 'screens/hostel_screens.dart';
import 'theme/app_theme.dart';

class HostelHubApp extends StatefulWidget {
  const HostelHubApp({super.key});

  @override
  State<HostelHubApp> createState() => _HostelHubAppState();
}

class _HostelHubAppState extends State<HostelHubApp> {
  bool showSplash = true;
  bool onboardingComplete = false;
  bool loggedIn = false;

  @override
  Widget build(BuildContext context) {
    if (showSplash) {
      return MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: SplashScreen(
          onDone: () {
            setState(() {
              showSplash = false;
            });
          },
        ),
      );
    }

    if (!onboardingComplete) {
      return MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: OnboardingScreen(
          onComplete: () {
            setState(() {
              onboardingComplete = true;
            });
          },
        ),
      );
    }

    if (!loggedIn) {
      return MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: LoginScreen(
          onLogin: () {
            setState(() {
              loggedIn = true;
            });
          },
        ),
      );
    }

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const MainShell(),
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key, required this.onDone});
  final VoidCallback onDone;

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 1200), widget.onDone);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.lightTheme.scaffoldBackgroundColor,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            RichText(
              text: TextSpan(
                children: [
                  TextSpan(
                    text: 'Hostel',
                    style: AppTheme.lightTheme.textTheme.displayLarge?.copyWith(
                      color: AppColors.textPrimary,
                    ),
                  ),
                  TextSpan(
                    text: 'Hub',
                    style: AppTheme.lightTheme.textTheme.displayLarge?.copyWith(
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'Your hostel, organized.',
              style: AppTheme.lightTheme.textTheme.bodyLarge?.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key, required this.onComplete});
  final VoidCallback onComplete;

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _index = 0;

  final List<Map<String, String>> slides = const [
    {
      'title': 'Everything in one place',
      'subtitle': 'Manage rooms, services, and updates in a single app.'
    },
    {
      'title': 'Stay updated',
      'subtitle': 'Get alerts for mess, repairs, events, and important notices.'
    },
    {
      'title': 'Know what\'s next',
      'subtitle': 'Track schedules and keep your hostel routine on course.'
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: widget.onComplete,
                  child: const Text('Skip'),
                ),
              ),
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  itemCount: slides.length,
                  onPageChanged: (value) => setState(() => _index = value),
                  itemBuilder: (context, i) {
                    final slide = slides[i];
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            width: 180,
                            height: 180,
                            decoration: BoxDecoration(
                              color: AppColors.primaryLight
                                  .withValues(alpha: 0.25),
                              borderRadius: BorderRadius.circular(32),
                            ),
                            child: const Icon(Icons.dashboard_customize_rounded,
                                size: 72, color: AppColors.primary),
                          ),
                          const SizedBox(height: 40),
                          Text(
                            slide['title']!,
                            style: AppTheme.lightTheme.textTheme.headlineMedium,
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 12),
                          Text(
                            slide['subtitle']!,
                            style: AppTheme.lightTheme.textTheme.bodyLarge
                                ?.copyWith(color: AppColors.textSecondary),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  slides.length,
                  (index) => AnimatedContainer(
                    duration: const Duration(milliseconds: 220),
                    width: _index == index ? 28 : 8,
                    height: 8,
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    decoration: BoxDecoration(
                      color: _index == index
                          ? AppColors.primary
                          : AppColors.border,
                      borderRadius: BorderRadius.circular(999),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        if (_index < slides.length - 1) {
                          _pageController.nextPage(
                              duration: const Duration(milliseconds: 260),
                              curve: Curves.easeOut);
                        } else {
                          widget.onComplete();
                        }
                      },
                      child: Text(
                          _index < slides.length - 1 ? 'Next' : 'Get Started'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key, required this.onLogin});
  final VoidCallback onLogin;

  @override
  Widget build(BuildContext context) {
    final emailController = TextEditingController();
    final passwordController = TextEditingController();

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              RichText(
                text: TextSpan(
                  children: [
                    TextSpan(
                        text: 'Hostel',
                        style: AppTheme.lightTheme.textTheme.displayLarge
                            ?.copyWith(color: AppColors.textPrimary)),
                    TextSpan(
                        text: 'Hub',
                        style: AppTheme.lightTheme.textTheme.displayLarge
                            ?.copyWith(color: AppColors.primary)),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              AppTextField(
                  label: 'Email / Student ID', controller: emailController),
              const SizedBox(height: 16),
              AppTextField(
                  label: 'Password',
                  controller: passwordController,
                  obscureText: true),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: PrimaryButton(
                  label: 'Login',
                  onPressed: onLogin,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _selectedTab = 0;

  bool _drawerOpen = false;
  bool _panelOpen = false;

  @override
  Widget build(BuildContext context) {
    final screens = [
      HomeScreen(
        onOpenDrawer: () => setState(() => _drawerOpen = true),
        onOpenAccount: () => setState(() => _panelOpen = true),
      ),
      const ScheduleScreen(),
      const AlertsScreen(),
      const ProfileScreen(),
    ];

    return Stack(
      children: [
        Scaffold(
          body: screens[_selectedTab],
          bottomNavigationBar: AppBottomNavigation(
            currentIndex: _selectedTab,
            onTap: (index) => setState(() => _selectedTab = index),
            unreadAlerts: 3,
          ),
        ),
        if (_drawerOpen)
          Positioned.fill(
            child: GestureDetector(
              onTap: () => setState(() => _drawerOpen = false),
              child: Container(color: Colors.black38),
            ),
          ),
        AnimatedPositioned(
          duration: const Duration(milliseconds: 260),
          curve: Curves.easeOut,
          left: _drawerOpen ? 0 : -320,
          top: 0,
          bottom: 0,
          width: MediaQuery.of(context).size.width * 0.85,
          child: HamburgerDrawer(
            onClose: () => setState(() => _drawerOpen = false),
          ),
        ),
        AnimatedPositioned(
          duration: const Duration(milliseconds: 260),
          curve: Curves.easeOut,
          right: _panelOpen ? 0 : -360,
          top: 0,
          bottom: 0,
          width: MediaQuery.of(context).size.width * 0.88,
          child: AccountPanel(
            onClose: () => setState(() => _panelOpen = false),
          ),
        ),
      ],
    );
  }
}
