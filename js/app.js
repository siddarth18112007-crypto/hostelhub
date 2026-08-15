const App = {
  init() {
    // Load theme from localStorage
    const currentTheme = SafeStorage.getItem('hh_theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="app-shell">
        <header id="app-header" class="app-header">
        </header>
        <main class="main-content" id="main-content">
          <div id="page-content"></div>
        </main>
        <nav id="bottom-nav" class="bottom-nav">
        </nav>
        <div id="drawer-overlay" class="drawer-overlay" onclick="Components.toggleDrawer()"></div>
        <aside id="drawer" class="drawer">
        </aside>
      </div>
    `;
    
    this.renderHeader();
    this.renderBottomNav();
    this.renderDrawer();
    this.registerRoutes();
    Router.init();
    
    if (window.lucide) {
      window.lucide.createIcons();
    }
  },
  
  renderHeader() {
    document.getElementById('app-header').innerHTML = Components.header();
  },
  
  renderBottomNav() {
    document.getElementById('bottom-nav').innerHTML = Components.bottomNav();
  },
  
  renderDrawer() {
    document.getElementById('drawer').innerHTML = Components.drawer();
  },
  
  registerRoutes() {
    // const/let globals aren't on window, so resolve them via typeof checks
    const pages = {};
    if (typeof SplashPage !== 'undefined') pages['splash'] = SplashPage;
    if (typeof OnboardingPage !== 'undefined') pages['onboarding'] = OnboardingPage;
    if (typeof LoginPage !== 'undefined') pages['login'] = LoginPage;
    if (typeof HomePage !== 'undefined') pages['home'] = HomePage;
    if (typeof SchedulePage !== 'undefined') pages['schedule'] = SchedulePage;
    if (typeof AlertsPage !== 'undefined') pages['alerts'] = AlertsPage;
    if (typeof ProfilePage !== 'undefined') pages['profile'] = ProfilePage;
    if (typeof RoomPage !== 'undefined') pages['room'] = RoomPage;
    if (typeof MessPage !== 'undefined') pages['mess'] = MessPage;
    if (typeof LaundryPage !== 'undefined') pages['laundry'] = LaundryPage;
    if (typeof RepairPage !== 'undefined') pages['repair'] = RepairPage;
    if (typeof EventsPage !== 'undefined') pages['events'] = EventsPage;
    if (typeof ResourcesPage !== 'undefined') pages['resources'] = ResourcesPage;
    if (typeof SettingsPage !== 'undefined') pages['settings'] = SettingsPage;
    if (typeof NotificationPrefsPage !== 'undefined') pages['notification-prefs'] = NotificationPrefsPage;
    if (typeof HelpPage !== 'undefined') pages['help'] = HelpPage;
    if (typeof ReportPage !== 'undefined') pages['report'] = ReportPage;
    if (typeof AboutPage !== 'undefined') pages['about'] = AboutPage;
    if (typeof AdminPage !== 'undefined') pages['admin'] = AdminPage;
    if (typeof StaffPage !== 'undefined') pages['staff'] = StaffPage;
    
    for (const [route, pageObj] of Object.entries(pages)) {
      if (pageObj && pageObj.render) {
        Router.register(route, () => pageObj.render());
      }
    }
    
    // Fallback for any unregistered routes
    const allRoutes = ['splash','onboarding','login','home','schedule','alerts','profile',
      'room','mess','laundry','repair','events','resources','settings',
      'notification-prefs','help','report','about', 'admin', 'staff'];
    
    allRoutes.forEach(route => {
      if (!pages[route]) {
        Router.register(route, () => {
          document.getElementById('page-content').innerHTML = `
            <div style="padding: 40px 16px; text-align: center;">
              <h2 style="color: var(--text-primary);">Coming Soon</h2>
              <p style="color: var(--text-secondary); margin-top: 8px;">This page is under development.</p>
              <button class="btn-primary" style="margin-top: 24px; max-width: 200px;" onclick="Router.navigate('home')">Go Home</button>
            </div>
          `;
        });
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
