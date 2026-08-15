window.RepairPage = {
    isFiling: false,

    async submitRequest() {
        const issue = document.getElementById('repair-issue').value.trim();
        const room = document.getElementById('repair-room').value.trim();

        if (!issue || !room) {
            alert('Please specify the issue and your room');
            return;
        }

        try {
            await ApiService.submitRepairRequest(issue, room);
            alert('Repair request filed successfully!');
            this.isFiling = false;
            this.loadAndRender();
        } catch (e) {
            console.warn('Filing request failed on API, adding locally:', e.message);
            // Fallback: local add
            if (window.AppData) {
                AppData.activeRepair = {
                    issue,
                    room,
                    date: 'Tomorrow, 2:00 PM – 4:00 PM',
                    technician: 'Arun (Static Mode)',
                    steps: [
                        { label: 'Reported', done: true },
                        { label: 'Assigned', done: false, current: true },
                        { label: 'Scheduled', done: false },
                        { label: 'Completed', done: false }
                    ]
                };
            }
            alert('Repair request filed successfully (Static Mode)!');
            this.isFiling = false;
            this.loadAndRender();
        }
    },

    toggleFilingView() {
        this.isFiling = !this.isFiling;
        this.loadAndRender();
    },

    async loadAndRender() {
        let active = null;
        let history = [];
        try {
            active = await ApiService.getActiveRepair();
            history = await ApiService.getRepairHistory();
        } catch (e) {
            console.warn('API error fetching repairs, showing local:', e.message);
            active = (window.AppData && AppData.activeRepair) || null;
            history = (window.AppData && AppData.repairHistory) || [];
        }
        this.renderUI(active, history);
    },

    render() {
        this.loadAndRender();
    },

    renderUI(active, history) {
        const container = document.getElementById('page-content');
        
        let activeHtml = '';
        if (!active) {
            activeHtml = `
                <div class="app-card" style="text-align: center; color: var(--text-secondary); padding: 16px;">
                    No active repair requests.
                </div>
            `;
        } else {
            const stepsHtml = (active.steps || []).map((step, i) => {
                let dotStyle = '';
                if (step.done) {
                    dotStyle = 'background: var(--success); color: white;';
                } else if (step.current) {
                    dotStyle = 'background: var(--primary); box-shadow: 0 0 0 4px rgba(50,109,240,0.2);';
                } else {
                    dotStyle = 'background: var(--border);';
                }
                return `
                    <div style="display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; z-index: 1;">
                        <div style="width: 20px; height: 20px; border-radius: 50%; ${dotStyle} display: flex; align-items: center; justify-content: center; border: 2px solid white;">
                            ${step.done ? '<i data-lucide="check" style="width: 10px; height: 10px;"></i>' : ''}
                        </div>
                        <div style="font-size: var(--fs-caption); color: var(--text-secondary); margin-top: 4px; text-align: center;">${step.label}</div>
                    </div>
                `;
            }).join('');

            activeHtml = `
                <div class="app-card">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--sp-md);">
                        <div>
                            <h4 style="margin: 0; font-size: var(--fs-card-heading); font-weight: 600; color: var(--text-primary);">${active.issue}</h4>
                            <div style="font-size: var(--fs-small); color: var(--text-secondary); margin-top: 4px;">${active.room} · ${active.date}</div>
                        </div>
                        <span class="status-badge badge-info">${active.status || 'In Progress'}</span>
                    </div>
                    <div style="font-size: var(--fs-small); color: var(--text-secondary); margin-bottom: var(--sp-lg); display: flex; align-items: center; gap: 4px;">
                        <i data-lucide="user" style="width: 14px; height: 14px;"></i> Technician: ${active.technician}
                    </div>
                    
                    <div style="display: flex; align-items: flex-start; position: relative; padding: 0 4px;">
                        <div style="position: absolute; top: 10px; left: 30px; right: 30px; height: 2px; background: var(--divider); z-index: 0;"></div>
                        ${stepsHtml}
                    </div>
                </div>
            `;
        }

        let historyHtml = '';
        if (history.length === 0) {
            historyHtml = '<div style="text-align: center; color: var(--text-tertiary); padding: 16px;">No repair history available</div>';
        } else {
            historyHtml = history.map(req => `
                <div class="app-card" style="margin-bottom: var(--sp-sm); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: 600; color: var(--text-primary);">${req.issue}</div>
                        <div style="font-size: var(--fs-small); color: var(--text-secondary); margin-top: 4px;">${req.date} · Tech: ${req.technician}</div>
                    </div>
                    <span class="status-badge badge-success">Completed</span>
                </div>
            `).join('');
        }

        let mainContentHtml = '';

        if (this.isFiling) {
            mainContentHtml = `
                <div class="app-card">
                    <h3 style="font-size: var(--fs-card-heading); font-weight: 600; margin-bottom: var(--sp-lg);">File a Repair Request</h3>
                    
                    <div class="input-group">
                        <label for="repair-issue">Describe the Problem</label>
                        <textarea id="repair-issue" class="input-field" placeholder="e.g. Fan speed regulator is broken, water tap leakage..."></textarea>
                    </div>

                    <div class="input-group" style="margin-top: var(--sp-md);">
                        <label for="repair-room">Room Number</label>
                        <input type="text" id="repair-room" class="input-field" value="${window.AppData && AppData.student ? AppData.student.block + ' - ' + AppData.student.room : 'B - 304'}" />
                    </div>

                    <div style="display: flex; gap: var(--sp-md); margin-top: 24px;">
                        <button class="btn-secondary" onclick="RepairPage.toggleFilingView()" style="flex: 1;">Cancel</button>
                        <button class="btn-primary" onclick="RepairPage.submitRequest()" style="flex: 1;">Submit Request</button>
                    </div>
                </div>
            `;
        } else {
            mainContentHtml = `
                <div class="section-header">
                    <h2>Active Request</h2>
                    <span class="view-all" onclick="RepairPage.toggleFilingView()">+ New Request</span>
                </div>
                <div style="margin-bottom: var(--sp-xxl);">
                    ${activeHtml}
                </div>
                
                <div class="section-header"><h2>History</h2></div>
                <div class="history-list">
                    ${historyHtml}
                </div>
            `;
        }

        container.innerHTML = `
            <div style="padding: var(--sp-xl) var(--page-padding) var(--sp-xxxl);">
                <div class="page-header" style="padding-left: 0; padding-top: 0; margin-bottom: var(--sp-lg); display: flex; align-items: center; gap: var(--sp-md);">
                    <button class="icon-btn back-btn" onclick="history.back()">
                        <i data-lucide="arrow-left"></i>
                    </button>
                    <h1 style="font-size: var(--fs-page-title); font-weight: var(--fw-bold); margin: 0;">Repairs</h1>
                </div>
                
                <div class="service-page-hero" style="background-color: var(--repair-bg); color: var(--repair-icon);">
                    <div style="background: white; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-card);">
                        <i data-lucide="wrench" style="width: 24px; height: 24px; color: var(--repair-icon);"></i>
                    </div>
                    <div>
                        <h2 style="font-size: var(--fs-section); font-weight: 700; margin: 0;">Maintenance & Repairs</h2>
                        <div style="font-size: var(--fs-small); opacity: 0.8; margin-top: 2px;">Report room problems & track fixes</div>
                    </div>
                </div>

                <div style="margin-top: var(--sp-xl);">
                    ${mainContentHtml}
                </div>
                <div style="height: 40px;"></div>
            </div>
        `;
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
};
