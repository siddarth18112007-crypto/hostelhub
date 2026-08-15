const AdminPage = {
  activeTab: 'repairs',
  stats: {},
  repairs: [],
  resources: [],
  selectedRepairId: null,

  async loadData() {
    try {
      this.stats = await ApiService.getAdminStats();
      this.repairs = await ApiService.getAllRepairs();
      this.resources = await ApiService.getResources();
    } catch (e) {
      console.error('Error loading admin data:', e);
    }
  },

  async setTab(tab) {
    this.activeTab = tab;
    this.selectedRepairId = null;
    await this.loadData();
    this.renderUI();
  },

  async handleAssignRepair(e) {
    e.preventDefault();
    const repairId = document.getElementById('assign-repair-id').value;
    const staff = document.getElementById('assign-staff').value;
    const priority = document.getElementById('assign-priority').value;
    const schedTime = document.getElementById('assign-time').value;

    try {
      await ApiService.assignRepair(repairId, staff, priority, schedTime);
      alert('Repair request assigned successfully.');
      this.selectedRepairId = null;
      await this.loadData();
      this.renderUI();
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  },

  async handleUpdateMess(e) {
    e.preventDefault();
    const meal = document.getElementById('mess-meal').value;
    const items = document.getElementById('mess-items').value.trim();

    if (!items) {
      alert('Please specify the menu items.');
      return;
    }

    try {
      await ApiService.updateMessMenu(meal, items);
      alert('Mess menu updated successfully. Notice and alert sent to students.');
      document.getElementById('mess-items').value = '';
      await this.loadData();
      this.renderUI();
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  },

  async handlePublishNotice(e) {
    e.preventDefault();
    const title = document.getElementById('notice-title').value.trim();
    const msg = document.getElementById('notice-msg').value.trim();
    const priority = document.getElementById('notice-priority').value;

    if (!title || !msg) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      await ApiService.publishNotice(title, msg, priority);
      alert('Notice published. Alert broadcasted successfully.');
      document.getElementById('notice-title').value = '';
      document.getElementById('notice-msg').value = '';
      await this.loadData();
      this.renderUI();
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  },

  async handleCreateEvent(e) {
    e.preventDefault();
    const title = document.getElementById('event-title').value.trim();
    const date = document.getElementById('event-date').value;
    const time = document.getElementById('event-time').value;
    const venue = document.getElementById('event-venue').value.trim();
    const capacity = document.getElementById('event-capacity').value;

    if (!title || !date || !time || !venue || !capacity) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      await ApiService.createEvent(title, date, time, venue, capacity);
      alert('Event created successfully.');
      document.getElementById('event-title').value = '';
      document.getElementById('event-venue').value = '';
      document.getElementById('event-capacity').value = '100';
      await this.loadData();
      this.renderUI();
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  },

  async handleUpdateResource(name, status) {
    try {
      await ApiService.updateResourceStatus(name, status);
      await this.loadData();
      this.renderUI();
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  },

  handleLogout() {
    ApiService.logout();
    Router.navigate('login');
  },

  async render() {
    await this.loadData();
    this.renderUI();
  },

  renderUI() {
    const container = document.getElementById('page-content');
    
    // Admin Dashboard Header
    const headerHtml = `
      <div style="background-color: var(--deep-navy); color: white; padding: 24px var(--page-padding); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border);">
        <div>
          <div style="font-size: 20px; font-weight: 700;">Warden Console</div>
          <div style="font-size: var(--fs-small); opacity: 0.85; margin-top: 2px;">HostelHub Operations</div>
        </div>
        <button class="btn-outlined" onclick="AdminPage.handleLogout()" style="border-color: rgba(255,255,255,0.3); color: white; background: none; font-size: var(--fs-small); padding: 6px 14px; border-radius: var(--radius-button); cursor: pointer;">
          Logout
        </button>
      </div>
    `;

    // Stats Grid
    const statsHtml = `
      <div style="padding: var(--sp-lg) var(--page-padding) 0;">
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--sp-md);">
          <div class="app-card" style="padding: var(--sp-md); display: flex; flex-direction: column;">
            <span style="font-size: var(--fs-caption); color: var(--text-secondary); text-transform: uppercase; font-weight: 600;">Total Students</span>
            <span style="font-size: 24px; font-weight: 700; color: var(--primary); margin-top: 4px;">${this.stats.totalStudents || 0}</span>
          </div>
          <div class="app-card" style="padding: var(--sp-md); display: flex; flex-direction: column;">
            <span style="font-size: var(--fs-caption); color: var(--text-secondary); text-transform: uppercase; font-weight: 600;">Occupied Rooms</span>
            <span style="font-size: 24px; font-weight: 700; color: var(--text-primary); margin-top: 4px;">${this.stats.occupiedRooms || 0}</span>
          </div>
          <div class="app-card" style="padding: var(--sp-md); display: flex; flex-direction: column;">
            <span style="font-size: var(--fs-caption); color: var(--text-secondary); text-transform: uppercase; font-weight: 600;">Open Repairs</span>
            <span style="font-size: 24px; font-weight: 700; color: #E04B55; margin-top: 4px;">${this.stats.openRepairs || 0}</span>
          </div>
          <div class="app-card" style="padding: var(--sp-md); display: flex; flex-direction: column;">
            <span style="font-size: var(--fs-caption); color: var(--text-secondary); text-transform: uppercase; font-weight: 600;">Resources Used</span>
            <span style="font-size: 24px; font-weight: 700; color: #22A6A6; margin-top: 4px;">${this.stats.resourceUsage || 0}</span>
          </div>
        </div>
      </div>
    `;

    // Tabs Navigation
    const tabs = [
      { id: 'repairs', label: 'Repairs' },
      { id: 'mess', label: 'Mess' },
      { id: 'events', label: 'Events' },
      { id: 'notices', label: 'Notices' },
      { id: 'resources', label: 'Facilities' }
    ];
    const tabsHtml = `
      <div style="padding: var(--sp-lg) var(--page-padding) 0;">
        <div style="display: flex; gap: var(--sp-sm); overflow-x: auto; white-space: nowrap; scrollbar-width: none; border-bottom: 1px solid var(--divider); padding-bottom: var(--sp-sm);">
          ${tabs.map(t => `
            <div class="chip ${this.activeTab === t.id ? 'active' : ''}" onclick="AdminPage.setTab('${t.id}')">${t.label}</div>
          `).join('')}
        </div>
      </div>
    `;

    // Tab Contents
    let tabContentHtml = '';

    if (this.activeTab === 'repairs') {
      if (this.selectedRepairId) {
        const repair = this.repairs.find(r => r.id === this.selectedRepairId);
        tabContentHtml = `
          <div style="padding: var(--sp-lg) var(--page-padding);">
            <div style="display: flex; align-items: center; gap: var(--sp-xs); margin-bottom: var(--sp-lg); cursor: pointer;" onclick="AdminPage.setTab('repairs')">
              <i data-lucide="arrow-left" style="width: 18px; height: 18px;"></i>
              <span style="font-weight: 600; font-size: var(--fs-body);">Back to Tickets</span>
            </div>
            
            <div class="app-card" style="padding: var(--sp-lg); margin-bottom: var(--sp-lg);">
              <div style="font-weight: 700; font-size: 18px; color: var(--text-primary);">${repair.issue}</div>
              <div style="font-size: var(--fs-body); color: var(--text-secondary); margin-top: 4px;">Logged on behalf of: ${repair.room}</div>
              <div style="font-size: var(--fs-small); color: var(--text-tertiary); margin-top: var(--sp-xs);">Current Status: <strong>${repair.status}</strong></div>
            </div>

            <form onsubmit="AdminPage.handleAssignRepair(event)" style="display: flex; flex-direction: column; gap: var(--sp-md);">
              <input type="hidden" id="assign-repair-id" value="${repair.id}" />
              
              <div>
                <label style="display: block; font-size: var(--fs-small); font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Assign Staff Member</label>
                <select class="input-field" id="assign-staff" style="background: var(--surface);">
                  <option value="Arun (Technician)">Arun (AC/Electrician)</option>
                  <option value="Ravi (Plumber)">Ravi (Plumbing)</option>
                  <option value="Kumar (Carpenter)">Kumar (Woodwork/Locksmith)</option>
                </select>
              </div>

              <div>
                <label style="display: block; font-size: var(--fs-small); font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Priority Level</label>
                <select class="input-field" id="assign-priority" style="background: var(--surface);">
                  <option value="HIGH">High Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="LOW">Low Priority</option>
                </select>
              </div>

              <div>
                <label style="display: block; font-size: var(--fs-small); font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Schedule Appointment Time</label>
                <input type="text" class="input-field" id="assign-time" value="Tomorrow, 2:00 PM – 4:00 PM" required />
              </div>

              <button type="submit" class="btn-primary" style="margin-top: 12px; height: 48px;">Assign Ticket</button>
            </form>
          </div>
        `;
      } else {
        const pending = this.repairs.filter(r => r.status !== 'Completed');
        const done = this.repairs.filter(r => r.status === 'Completed');

        tabContentHtml = `
          <div style="padding: var(--sp-lg) var(--page-padding);">
            <div style="font-weight: 700; font-size: var(--fs-section); color: var(--text-primary); margin-bottom: var(--sp-md);">Active Maintenance Tickets</div>
            ${pending.length === 0 ? `
              <div style="text-align: center; color: var(--text-tertiary); padding: var(--sp-xxl) 0;">No active repair tickets.</div>
            ` : pending.map(r => `
              <div class="app-card" onclick="AdminPage.selectedRepairId = ${r.id}; AdminPage.renderUI();" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: var(--sp-lg); margin-bottom: var(--sp-md); border-left: 4px solid ${r.status === 'Reported' ? '#E04B55' : '#326DF0'};">
                <div>
                  <div style="font-weight: 700; font-size: var(--fs-body); color: var(--text-primary);">${r.issue}</div>
                  <div style="font-size: var(--fs-small); color: var(--text-secondary); margin-top: 4px;">${r.room} · ${r.date}</div>
                  <div style="font-size: var(--fs-caption); color: var(--text-tertiary); margin-top: 4px;">Tech: ${r.technician}</div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: var(--sp-xs);">
                  <span style="font-size: 11px; padding: 2px 8px; border-radius: 20px; font-weight: 600; background: ${r.status === 'Reported' ? '#FFF0F1' : '#F0F6FF'}; color: ${r.status === 'Reported' ? '#E04B55' : '#326DF0'};">${r.status}</span>
                  <span style="font-size: 12px; color: var(--primary); font-weight: 600; display: flex; align-items: center; gap: 2px;">Assign <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i></span>
                </div>
              </div>
            `).join('')}

            <div style="font-weight: 700; font-size: var(--fs-section); color: var(--text-primary); margin-top: var(--sp-xxl); margin-bottom: var(--sp-md);">Resolved History</div>
            ${done.map(r => `
              <div class="app-card" style="padding: var(--sp-lg); margin-bottom: var(--sp-md); opacity: 0.8;">
                <div style="font-weight: 700; font-size: var(--fs-body); color: var(--text-primary);">${r.issue}</div>
                <div style="font-size: var(--fs-small); color: var(--text-secondary); margin-top: 4px;">${r.room} · Resolved by ${r.technician}</div>
              </div>
            `).join('')}
          </div>
        `;
      }
    } 
    else if (this.activeTab === 'mess') {
      tabContentHtml = `
        <div style="padding: var(--sp-lg) var(--page-padding);">
          <div style="font-weight: 700; font-size: var(--fs-section); color: var(--text-primary); margin-bottom: var(--sp-lg);">Modify Mess Menu</div>
          
          <form onsubmit="AdminPage.handleUpdateMess(event)" style="display: flex; flex-direction: column; gap: var(--sp-md);">
            <div>
              <label style="display: block; font-size: var(--fs-small); font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Select Meal Slot</label>
              <select class="input-field" id="mess-meal" style="background: var(--surface);">
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="snacks">Snacks (Tea time)</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: var(--fs-small); font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Meal Items (comma-separated)</label>
              <textarea class="input-field" id="mess-items" style="height: 100px; padding: 12px; background: var(--surface);" placeholder="e.g. Masala Dosa, Chutney, Tea, Coffee"></textarea>
            </div>

            <button type="submit" class="btn-primary" style="margin-top: 12px; height: 48px;">Publish Update</button>
          </form>
        </div>
      `;
    } 
    else if (this.activeTab === 'events') {
      tabContentHtml = `
        <div style="padding: var(--sp-lg) var(--page-padding);">
          <div style="font-weight: 700; font-size: var(--fs-section); color: var(--text-primary); margin-bottom: var(--sp-lg);">Publish Upcoming Event</div>
          
          <form onsubmit="AdminPage.handleCreateEvent(event)" style="display: flex; flex-direction: column; gap: var(--sp-md);">
            <div>
              <label style="display: block; font-size: var(--fs-small); font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Event Name</label>
              <input type="text" class="input-field" id="event-title" placeholder="e.g. Badminton Singles Championship" required />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-md);">
              <div>
                <label style="display: block; font-size: var(--fs-small); font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Event Date</label>
                <input type="text" class="input-field" id="event-date" placeholder="e.g. 24 Aug" required />
              </div>
              <div>
                <label style="display: block; font-size: var(--fs-small); font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Event Time</label>
                <input type="text" class="input-field" id="event-time" placeholder="e.g. 6:00 PM" required />
              </div>
            </div>

            <div>
              <label style="display: block; font-size: var(--fs-small); font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Venue / Ground</label>
              <input type="text" class="input-field" id="event-venue" placeholder="e.g. Court 3, Sports Complex" required />
            </div>

            <div>
              <label style="display: block; font-size: var(--fs-small); font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Maximum Registrations Capacity</label>
              <input type="number" class="input-field" id="event-capacity" value="100" min="1" required />
            </div>

            <button type="submit" class="btn-primary" style="margin-top: 12px; height: 48px;">Publish Event</button>
          </form>
        </div>
      `;
    } 
    else if (this.activeTab === 'notices') {
      tabContentHtml = `
        <div style="padding: var(--sp-lg) var(--page-padding);">
          <div style="font-weight: 700; font-size: var(--fs-section); color: var(--text-primary); margin-bottom: var(--sp-lg);">Broadcast Hostel Notice</div>
          
          <form onsubmit="AdminPage.handlePublishNotice(event)" style="display: flex; flex-direction: column; gap: var(--sp-md);">
            <div>
              <label style="display: block; font-size: var(--fs-small); font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Notice Title</label>
              <input type="text" class="input-field" id="notice-title" placeholder="e.g. Maintenance Water Interruption" required />
            </div>

            <div>
              <label style="display: block; font-size: var(--fs-small); font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Urgency Priority</label>
              <select class="input-field" id="notice-priority" style="background: var(--surface);">
                <option value="GENERAL">General Notice</option>
                <option value="IMPORTANT">Important notice</option>
                <option value="URGENT">URGENT BOLD NOTICE</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: var(--fs-small); font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Detailed Announcement Message</label>
              <textarea class="input-field" id="notice-msg" style="height: 120px; padding: 12px; background: var(--surface);" placeholder="Water shut off in Block B from 2:00 PM to 4:00 PM..." required></textarea>
            </div>

            <button type="submit" class="btn-primary" style="margin-top: 12px; height: 48px;">Publish & Broadcast</button>
          </form>
        </div>
      `;
    } 
    else if (this.activeTab === 'resources') {
      tabContentHtml = `
        <div style="padding: var(--sp-lg) var(--page-padding);">
          <div style="font-weight: 700; font-size: var(--fs-section); color: var(--text-primary); margin-bottom: var(--sp-md);">Facility & Shared Spaces Controller</div>
          
          ${this.resources.map(res => {
            const statusColors = {
              AVAILABLE: '#EDF9F2',
              OCCUPIED: '#FFF0F1',
              RESERVED: '#F0F6FF',
              MAINTENANCE: '#FFF0F1'
            };
            const textColors = {
              AVAILABLE: '#35A86F',
              OCCUPIED: '#E04B55',
              RESERVED: '#326DF0',
              MAINTENANCE: '#E04B55'
            };
            
            return `
              <div class="app-card" style="padding: var(--sp-lg); margin-bottom: var(--sp-md); display: flex; flex-direction: column; gap: var(--sp-md);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <div style="font-weight: 700; font-size: var(--fs-body); color: var(--text-primary);">${res.name}</div>
                    <div style="font-size: var(--fs-small); color: var(--text-secondary); margin-top: 2px;">${res.location}</div>
                  </div>
                  <span style="font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; background: ${statusColors[res.status] || '#eee'}; color: ${textColors[res.status] || '#333'};">
                    ${res.status}
                  </span>
                </div>
                
                <div style="display: flex; gap: var(--sp-sm); margin-top: 4px;">
                  <button class="btn-outlined" style="padding: 4px 10px; font-size: 12px; flex: 1; height: auto;" onclick="AdminPage.handleUpdateResource('${res.name}', 'AVAILABLE')">Available</button>
                  <button class="btn-outlined" style="padding: 4px 10px; font-size: 12px; flex: 1; height: auto; border-color: #E04B55; color: #E04B55;" onclick="AdminPage.handleUpdateResource('${res.name}', 'OCCUPIED')">Occupied</button>
                  <button class="btn-outlined" style="padding: 4px 10px; font-size: 12px; flex: 1; height: auto;" onclick="AdminPage.handleUpdateResource('${res.name}', 'MAINTENANCE')">Maint.</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    container.innerHTML = `
      <div style="min-height: 100vh; background-color: var(--bg); padding-bottom: 60px;">
        ${headerHtml}
        ${statsHtml}
        ${tabsHtml}
        ${tabContentHtml}
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
};

window.AdminPage = AdminPage;
