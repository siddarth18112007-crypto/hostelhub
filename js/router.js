const Router = {
  routes: {},
  currentPage: null,
  history: [],
  
  register(hash, renderFn) {
    this.routes[hash] = renderFn;
  },
  
  navigate(hash) {
    window.location.hash = hash;
  },
  
  back() {
    if (this.history.length > 1) {
      this.history.pop();
      const prev = this.history[this.history.length - 1];
      window.location.hash = prev;
    } else {
      window.location.hash = 'home';
    }
  },
  
  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },
  
  handleRoute() {
    const hash = window.location.hash.slice(1) || 'splash';
    const renderFn = this.routes[hash];
    if (renderFn) {
      this.currentPage = hash;
      this.history.push(hash);
      
      const pageContent = document.getElementById('page-content');
      if (pageContent) {
        pageContent.classList.remove('page-active-animate');
        void pageContent.offsetWidth; // trigger layout reflow to restart keyframes
        pageContent.classList.add('page-active-animate');
      }
      
      // Let the page render itself into page-content
      renderFn();
      
      this.updateNav();
      this.updateHeader();
      
      // Scroll to top
      const mainContent = document.getElementById('main-content');
      if (mainContent) mainContent.scrollTop = 0;
      window.scrollTo(0, 0);
      
      // Re-initialize Lucide icons
      if (window.lucide) {
        window.lucide.createIcons();
      }
    }
  },
  
  updateNav() {
    const navEl = document.getElementById('nav-el'); 
    const actualNav = document.getElementById('bottom-nav');
    const headerEl = document.getElementById('app-header');
    const fullPages = ['splash', 'onboarding', 'login', 'admin', 'staff'];
    
    if (actualNav) actualNav.style.display = fullPages.includes(this.currentPage) ? 'none' : 'flex';
    if (headerEl) headerEl.style.display = fullPages.includes(this.currentPage) ? 'none' : 'flex';
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === this.currentPage);
    });

    // Update unread alerts count badges in bottom nav and top header
    if (window.AppData && AppData.alerts) {
      const unreadCount = AppData.alerts.filter(a => a.unread).length;
      document.querySelectorAll('.nav-badge').forEach(badge => {
        if (unreadCount > 0) {
          badge.style.display = 'block';
        } else {
          badge.style.display = 'none';
        }
      });
    }
  },
  
  updateHeader() {
    const headerTitle = document.getElementById('header-title');
    const headerSubtitle = document.getElementById('header-subtitle');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const backBtn = document.getElementById('back-btn');
    
    const servicePagesMap = {
      room: 'Room', mess: 'Mess', laundry: 'Laundry', repair: 'Repair',
      events: 'Events', resources: 'Resources', settings: 'Settings',
      'notification-prefs': 'Notifications', help: 'Help & Support',
      report: 'Report a Problem', about: 'About'
    };
    
    if (this.currentPage === 'home') {
      if (headerTitle) headerTitle.innerHTML = '<span class="brand-dark">Hostel</span><span class="brand-hub">Hub</span>';
      if (headerSubtitle) { headerSubtitle.textContent = 'Your hostel, organized.'; headerSubtitle.style.display = 'block'; }
      if (hamburgerBtn) hamburgerBtn.style.display = 'flex';
      if (backBtn) backBtn.style.display = 'none';
    } else if (servicePagesMap[this.currentPage]) {
      if (headerTitle) headerTitle.textContent = servicePagesMap[this.currentPage];
      if (headerSubtitle) { headerSubtitle.textContent = ''; headerSubtitle.style.display = 'none'; }
      if (hamburgerBtn) hamburgerBtn.style.display = 'none';
      if (backBtn) backBtn.style.display = 'flex';
    } else {
      const titles = { schedule: 'Schedule', alerts: 'Alerts', profile: 'Profile' };
      if (headerTitle) headerTitle.textContent = titles[this.currentPage] || '';
      
      // Specifically show "Stay updated with important things" subtitle on Alerts page header
      if (this.currentPage === 'alerts') {
        if (headerSubtitle) { headerSubtitle.textContent = 'Stay updated with important things'; headerSubtitle.style.display = 'block'; }
      } else {
        if (headerSubtitle) { headerSubtitle.textContent = ''; headerSubtitle.style.display = 'none'; }
      }
      
      if (hamburgerBtn) hamburgerBtn.style.display = 'flex';
      if (backBtn) backBtn.style.display = 'none';
    }

    // Update Header Action Buttons based on page (bell/avatar vs search/filter)
    const headerActions = document.querySelector('.header-actions');
    if (headerActions) {
      if (this.currentPage === 'alerts') {
        headerActions.innerHTML = `
          <button class="icon-btn" onclick="alert('Search feature coming soon!')">
            <i data-lucide="search" style="width: 22px; height: 22px;"></i>
          </button>
          <button class="icon-btn" onclick="alert('Filters coming soon!')">
            <i data-lucide="sliders-horizontal" style="width: 22px; height: 22px;"></i>
          </button>
        `;
      } else {
        headerActions.innerHTML = `
          <button class="icon-btn" onclick="Router.navigate('alerts')">
            <i data-lucide="bell" style="width: 22px; height: 22px;"></i>
            <span class="nav-badge"></span>
          </button>
          <div class="profile-avatar" style="width: 32px; height: 32px; font-size: 14px; margin: 0; cursor: pointer;" onclick="Router.navigate('profile')">S</div>
        `;
      }
      
      if (window.lucide) {
        window.lucide.createIcons();
      }
    }
  }
};

window.Router = Router;
