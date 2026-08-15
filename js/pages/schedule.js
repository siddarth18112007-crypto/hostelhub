const SchedulePage = {
    activeTab: 'Today',
    activeFilter: 'All',

    setTab(tab) {
        this.activeTab = tab;
        this.loadAndRender();
    },

    setFilter(filter) {
        this.activeFilter = filter;
        this.loadAndRender();
    },

    getServiceStyle(type) {
        switch((type || '').toLowerCase()) {
            case 'mess': return '#326DF0';
            case 'laundry': return '#061258';
            case 'repair': return '#E04B55';
            case 'events': return '#35A86F';
            default: return '#ccc';
        }
    },

    getBadgeClass(status) {
        switch((status || '').toLowerCase()) {
            case 'completed': return 'badge-success';
            case 'upcoming': return 'badge-warning';
            case 'scheduled': return 'badge-info';
            default: return '';
        }
    },

    async loadAndRender() {
        // Fetch period schedule items
        let items = [];
        try {
            const periodMap = { 'Today': 'today', 'Tomorrow': 'tomorrow', 'This Week': 'this_week' };
            items = await ApiService.getSchedule(periodMap[this.activeTab], this.activeFilter);
        } catch (err) {
            console.warn('API error fetching schedule, falling back to local:', err.message);
            if (this.activeTab === 'Today') {
                items = (window.AppData && AppData.todaySchedule) || [];
            } else if (this.activeTab === 'Tomorrow') {
                items = (window.AppData && AppData.tomorrowSchedule) || [];
            } else if (this.activeTab === 'This Week') {
                items = [...((window.AppData && AppData.todaySchedule) || []), ...((window.AppData && AppData.tomorrowSchedule) || [])];
            }

            if (this.activeFilter !== 'All') {
                items = items.filter(item => item.type && item.type.toLowerCase() === this.activeFilter.toLowerCase());
            }
        }
        this.renderUI(items);
    },

    render() {
        this.loadAndRender();
    },

    renderUI(items) {
        let html = `
            <div style="padding: var(--sp-xl) var(--page-padding) var(--sp-xxxl);">
                <div class="page-header" style="padding-left: 0; padding-top: 0; margin-bottom: var(--sp-lg);">
                    <h1 style="font-size: var(--fs-page-title); font-weight: var(--fw-bold);">Schedule</h1>
                </div>

                <div class="schedule-tabs">
                    ${['Today', 'Tomorrow', 'This Week'].map(tab => 
                        `<div class="schedule-tab chip ${this.activeTab === tab ? 'active' : ''}" onclick="SchedulePage.setTab('${tab}')">${tab}</div>`
                    ).join('')}
                </div>
                
                <div class="schedule-filters">
                    ${['All', 'Mess', 'Laundry', 'Repair', 'Events'].map(filter => 
                        `<div class="chip ${this.activeFilter === filter ? 'active' : ''}" onclick="SchedulePage.setFilter('${filter}')">${filter}</div>`
                    ).join('')}
                </div>
                
                <div id="schedule-content" style="margin-top: var(--sp-lg);">
        `;

        if (items.length === 0) {
            html += `
              <div style="text-align: center; padding: 48px 16px; color: var(--text-tertiary);">
                <i data-lucide="calendar" style="width: 48px; height: 48px; margin-bottom: 12px; stroke-width: 1.5;"></i>
                <div style="font-size: var(--fs-body); color: var(--text-secondary);">No schedule items found.</div>
              </div>
            `;
        } else {
            html += `<div class="timeline">`;
            html += items.map(item => `
                <div class="timeline-item">
                    <div class="timeline-time">${item.time}</div>
                    <div class="timeline-dot" style="background-color: ${this.getServiceStyle(item.type)};"></div>
                    <div class="timeline-card app-card">
                        <div class="card-header">
                            <i data-lucide="${item.icon || 'circle'}" style="color: ${this.getServiceStyle(item.type)};"></i>
                            <div class="card-title">${item.title}</div>
                            <div class="status-badge ${this.getBadgeClass(item.status)}">${item.status}</div>
                        </div>
                        <div class="card-body">
                            <div>${item.category || ''} • ${item.location || ''}</div>
                            ${item.endTime ? `<div>${item.time} – ${item.endTime}</div>` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
            html += `</div>`;
        }

        html += `
                </div>
                <div style="height: 40px;"></div>
            </div>
        `;
        
        const container = document.getElementById('page-content');
        if (container) {
            container.innerHTML = html;
        }
        if (window.lucide) {
            lucide.createIcons();
        }
    }
};

window.SchedulePage = SchedulePage;
