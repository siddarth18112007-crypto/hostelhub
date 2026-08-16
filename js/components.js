const Components = {
  header() {
    return `
      <div style="display: flex; align-items: center; gap: var(--sp-sm);">
        <button id="hamburger-btn" class="icon-btn" onclick="Components.toggleDrawer()">
          ${this.getLucideIcon('menu')}
        </button>
        <button id="back-btn" class="icon-btn" style="display:none;" onclick="window.history.back()">
          ${this.getLucideIcon('arrow-left')}
        </button>
        <div class="brand">
          <span id="header-title"></span>
          <div id="header-subtitle" style="font-size: var(--fs-caption); font-weight: normal; color: var(--text-secondary);"></div>
        </div>
      </div>
      <div class="header-actions">
        <button class="icon-btn" onclick="Router.navigate('alerts')">
          ${this.getLucideIcon('bell')}
          <span class="nav-badge"></span>
        </button>
        <div class="profile-avatar" style="width: 32px; height: 32px; font-size: 14px; margin: 0; cursor: pointer;" onclick="Router.navigate('profile')">S</div>
      </div>
    `;
  },
  
  bottomNav(activePage) {
    return `
      <button class="nav-item" data-page="home" onclick="Router.navigate('home')">
        <div class="icon-wrapper">${this.getLucideIcon('home')}</div>
        <span>Home</span>
      </button>
      <button class="nav-item" data-page="schedule" onclick="Router.navigate('schedule')">
        <div class="icon-wrapper">${this.getLucideIcon('calendar')}</div>
        <span>Schedule</span>
      </button>
      <button class="nav-item" data-page="alerts" onclick="Router.navigate('alerts')">
        <div class="icon-wrapper" style="position: relative;">
          ${this.getLucideIcon('bell')}
          <span class="nav-badge" style="top: -2px; right: 8px;"></span>
        </div>
        <span>Alerts</span>
      </button>
      <button class="nav-item" data-page="profile" onclick="Router.navigate('profile')">
        <div class="icon-wrapper">${this.getLucideIcon('user')}</div>
        <span>Profile</span>
      </button>
    `;
  },
  
  drawer() {
    const user = window.ApiService ? ApiService.getCurrentUser() : null;
    const name = user ? user.name : (AppData.student.name || 'Student');
    const id = user ? (user.id || user.email) : AppData.student.id;
    let html = `
      <div class="drawer-header">
        <div style="font-size: var(--fs-section); font-weight: 700; margin-bottom: 4px;">Hostel<span style="color: var(--primary)">Hub</span></div>
        <div style="font-size: var(--fs-small); color: var(--text-secondary);">${name} • ${id}</div>
      </div>
    `;
    
    const sections = {
      account: 'Account',
      activity: 'Activity',
      preferences: 'Preferences',
      support: 'Support'
    };
    
    for (const [key, title] of Object.entries(sections)) {
      html += `<div class="drawer-section">
        <div class="section-title">${title}</div>`;
        
      AppData.drawerMenu[key].forEach(item => {
        const page = item.page || 'home';
        html += `
          <div class="drawer-item" onclick="Components.toggleDrawer(); Router.navigate('${page}')">
            <span style="display:flex;align-items:center;width:20px;height:20px;flex-shrink:0;">${this.getLucideIcon(item.icon, 20)}</span>
            <span>${item.label}</span>
          </div>
        `;
      });
      html += `</div>`;
    }
    
    html += `
      <div class="drawer-section">
        <div class="drawer-item danger" onclick="Components.toggleDrawer(); if(window.ApiService) ApiService.logout(); Router.navigate('login')">
          <span style="display:flex;align-items:center;width:20px;height:20px;flex-shrink:0;">${this.getLucideIcon('log-out', 20)}</span>
          <span>Log Out</span>
        </div>
      </div>
    `;
    
    return html;
  },
  
  sectionHeader(title, linkText, linkPage) {
    return `
      <div class="section-header">
        <h2>${title}</h2>
        ${linkText ? `<span class="view-all" onclick="Router.navigate('${linkPage}')">${linkText}</span>` : ''}
      </div>
    `;
  },
  
  card(content, className = '') {
    return `<div class="app-card ${className}">${content}</div>`;
  },
  
  serviceCard(service) {
    const { icon, bg, color } = this.getServiceColor(service.id);
    return `
      <div class="app-card service-card" onclick="Router.navigate('${service.id}')" style="cursor: pointer;">
        <div class="icon-container" style="background-color: ${bg}; color: ${color};">
          ${this.getLucideIcon(service.icon)}
        </div>
        <div style="flex: 1;">
          <div style="font-weight: 600; font-size: var(--fs-card-heading);">${service.name}</div>
          <div style="font-size: var(--fs-caption); color: var(--text-secondary); margin-top: 4px;">${service.desc}</div>
        </div>
        <div style="color: var(--text-disabled);">
          ${this.getLucideIcon('chevron-right')}
        </div>
      </div>
    `;
  },
  
  statusBadge(text, type) {
    return `<span class="status-badge badge-${type}">${text}</span>`;
  },
  
  emptyState(icon, message) {
    return `
      <div class="empty-state">
        ${this.getLucideIcon(icon)}
        <div class="message">${message}</div>
      </div>
    `;
  },
  
  loadingSkeleton(count = 1) {
    return Array(count).fill('<div class="loading-skeleton"></div>').join('<div style="height: 8px;"></div>');
  },
  
  chip(text, active = false, onClick = '') {
    return `<button class="chip ${active ? 'active' : ''}" onclick="${onClick}">${text}</button>`;
  },
  
  inputField({ label, type = 'text', placeholder = '', value = '', error = '' }) {
    return `
      <div class="input-group">
        ${label ? `<label>${label}</label>` : ''}
        <input type="${type}" class="input-field ${error ? 'error' : ''}" placeholder="${placeholder}" value="${value}">
      </div>
    `;
  },
  
  button(text, type = 'primary', onClick = '') {
    return `<button class="btn-${type}" onclick="${onClick}">${text}</button>`;
  },
  
  pageHeader(title) {
    return `
      <div class="page-header">
        <button class="back-btn" onclick="window.history.back()">
          ${this.getLucideIcon('arrow-left')}
        </button>
        <h1>${title}</h1>
      </div>
    `;
  },
  
  toggleDrawer() {
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('drawer-overlay');
    if (drawer.classList.contains('open')) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
    } else {
      drawer.classList.add('open');
      overlay.classList.add('open');
    }
  },
  
  getServiceColor(type) {
    const colors = {
      room: { icon: 'var(--room-icon)', bg: 'var(--room-bg)', color: 'var(--room-icon)' },
      mess: { icon: 'var(--mess-icon)', bg: 'var(--mess-bg)', color: 'var(--mess-icon)' },
      laundry: { icon: 'var(--laundry-icon)', bg: 'var(--laundry-bg)', color: 'var(--laundry-icon)' },
      repair: { icon: 'var(--repair-icon)', bg: 'var(--repair-bg)', color: 'var(--repair-icon)' },
      events: { icon: 'var(--events-icon)', bg: 'var(--events-bg)', color: 'var(--events-icon)' },
      resources: { icon: 'var(--resources-icon)', bg: 'var(--resources-bg)', color: 'var(--resources-icon)' }
    };
    return colors[type] || { icon: 'var(--primary)', bg: 'var(--primary-light)', color: 'var(--primary)' };
  },
  
  getLucideIcon(name, size = 24) {
    return `<i data-lucide="${name}" style="width: ${size}px; height: ${size}px;"></i>`;
  }
};

window.Components = Components;
