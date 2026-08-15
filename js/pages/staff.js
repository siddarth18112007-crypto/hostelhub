const StaffPage = {
  repairs: [],
  selectedRepairId: null,

  async loadData() {
    try {
      this.repairs = await ApiService.getStaffRepairs();
    } catch (e) {
      console.error('Error loading staff data:', e);
    }
  },

  handleLogout() {
    ApiService.logout();
    Router.navigate('login');
  },

  async handleUpdateProgress(repairId, stepIndex) {
    try {
      await ApiService.updateRepairProgress(repairId, stepIndex);
      alert('Repair progress updated successfully.');
      this.selectedRepairId = null;
      await this.loadData();
      this.renderUI();
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  },

  async render() {
    await this.loadData();
    this.renderUI();
  },

  renderUI() {
    const container = document.getElementById('page-content');

    const headerHtml = `
      <div style="background-color: var(--deep-navy); color: white; padding: 24px var(--page-padding); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border);">
        <div>
          <div style="font-size: 20px; font-weight: 700;">Service Crew Console</div>
          <div style="font-size: var(--fs-small); opacity: 0.85; margin-top: 2px;">Assigned Work Orders</div>
        </div>
        <button class="btn-outlined" onclick="StaffPage.handleLogout()" style="border-color: rgba(255,255,255,0.3); color: white; background: none; font-size: var(--fs-small); padding: 6px 14px; border-radius: var(--radius-button); cursor: pointer;">
          Logout
        </button>
      </div>
    `;

    let contentHtml = '';

    if (this.selectedRepairId) {
      const r = this.repairs.find(rep => rep.id === this.selectedRepairId);
      
      contentHtml = `
        <div style="padding: var(--sp-lg) var(--page-padding);">
          <div style="display: flex; align-items: center; gap: var(--sp-xs); margin-bottom: var(--sp-lg); cursor: pointer;" onclick="StaffPage.selectedRepairId = null; StaffPage.renderUI();">
            <i data-lucide="arrow-left" style="width: 18px; height: 18px;"></i>
            <span style="font-weight: 600; font-size: var(--fs-body);">Back to Assignments</span>
          </div>

          <div class="app-card" style="padding: var(--sp-lg); margin-bottom: var(--sp-lg);">
            <div style="font-size: var(--fs-caption); font-weight: 600; color: #E04B55; text-transform: uppercase;">Ticket #${r.id}</div>
            <div style="font-weight: 700; font-size: 18px; color: var(--text-primary); margin-top: 4px;">${r.issue}</div>
            <div style="font-size: var(--fs-body); color: var(--text-secondary); margin-top: 4px;">Location: <strong>${r.room}</strong></div>
            <div style="font-size: var(--fs-body); color: var(--text-secondary); margin-top: 2px;">Schedule Time: ${r.date}</div>
          </div>

          <div style="font-weight: 700; font-size: var(--fs-section); color: var(--text-primary); margin-bottom: var(--sp-md);">Update Maintenance Stage</div>
          
          <div style="display: flex; flex-direction: column; gap: var(--sp-md);">
            <button class="btn-primary" style="height: 48px; background: #F0F6FF; color: var(--primary); border: 1px solid var(--primary-light);" onclick="StaffPage.handleUpdateProgress(${r.id}, 1)">
              Stage 1: Assign Confirmation
            </button>
            <button class="btn-primary" style="height: 48px; background: #F0F6FF; color: var(--primary); border: 1px solid var(--primary-light);" onclick="StaffPage.handleUpdateProgress(${r.id}, 2)">
              Stage 2: Schedule / Booked Appointment
            </button>
            <button class="btn-primary" style="height: 48px; background: #FFF0F1; color: #E04B55; border: 1px solid #FFD8DA;" onclick="StaffPage.handleUpdateProgress(${r.id}, 3)">
              Stage 3: Set Completed (Close Ticket)
            </button>
          </div>
        </div>
      `;
    } else {
      const activeJobs = this.repairs.filter(r => r.status !== 'Completed');
      const closedJobs = this.repairs.filter(r => r.status === 'Completed');

      contentHtml = `
        <div style="padding: var(--sp-lg) var(--page-padding);">
          <div style="font-weight: 700; font-size: var(--fs-section); color: var(--text-primary); margin-bottom: var(--sp-md);">Assigned Jobs</div>
          ${activeJobs.length === 0 ? `
            <div style="text-align: center; color: var(--text-tertiary); padding: var(--sp-xxl) 0;">No assigned jobs.</div>
          ` : activeJobs.map(r => `
            <div class="app-card" onclick="StaffPage.selectedRepairId = ${r.id}; StaffPage.renderUI();" style="cursor: pointer; padding: var(--sp-lg); margin-bottom: var(--sp-md); border-left: 4px solid #E04B55;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <div style="font-weight: 700; font-size: var(--fs-body); color: var(--text-primary);">${r.issue}</div>
                  <div style="font-size: var(--fs-small); color: var(--text-secondary); margin-top: 4px;">Room: ${r.room} · ${r.date}</div>
                </div>
                <span style="font-size: 11px; padding: 2px 8px; border-radius: 20px; font-weight: 600; background: #FFF0F1; color: #E04B55;">
                  ${r.status}
                </span>
              </div>
              <div style="text-align: right; color: var(--primary); font-size: var(--fs-small); font-weight: 600; margin-top: 8px;">
                Update Status ›
              </div>
            </div>
          `).join('')}

          <div style="font-weight: 700; font-size: var(--fs-section); color: var(--text-primary); margin-top: var(--sp-xxl); margin-bottom: var(--sp-md);">Completed Jobs</div>
          ${closedJobs.map(r => `
            <div class="app-card" style="padding: var(--sp-lg); margin-bottom: var(--sp-md); opacity: 0.7;">
              <div style="font-weight: 700; font-size: var(--fs-body); color: var(--text-primary);">${r.issue}</div>
              <div style="font-size: var(--fs-small); color: var(--text-secondary); margin-top: 2px;">Resolved for ${r.room} on ${r.date}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    container.innerHTML = `
      <div style="min-height: 100vh; background-color: var(--bg); padding-bottom: 60px;">
        ${headerHtml}
        ${contentHtml}
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
};

window.StaffPage = StaffPage;
