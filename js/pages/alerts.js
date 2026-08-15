const AlertsPage = {
    activeFilter: 'All',

    setFilter(filter) {
        this.activeFilter = filter;
        this.loadAndRender();
    },

    getAlertIcon(type) {
        switch((type || '').toLowerCase()) {
            case 'laundry': return 'washing-machine';
            case 'repair': return 'wrench';
            case 'mess': return 'utensils';
            case 'events': return 'calendar-days';
            case 'notice': return 'alert-triangle';
            case 'smart': return 'shield';
            default: return 'bell';
        }
    },

    getServiceStyle(type) {
        switch((type || '').toLowerCase()) {
            case 'mess': return { bg: '#EAF1FF', color: '#326DF0', label: 'Mess Update' };
            case 'laundry': return { bg: '#EAF1FF', color: '#061258', label: 'Laundry Update' };
            case 'repair': return { bg: '#FFF0F1', color: '#E04B55', label: 'Repair Update' };
            case 'events': return { bg: '#EDF9F2', color: '#35A86F', label: 'Event Update' };
            case 'notice': return { bg: '#FFF0F1', color: '#E04B55', label: 'Hostel Notice' };
            case 'smart': return { bg: '#EAF1FF', color: '#326DF0', label: '+ Smart Alert' };
            default: return { bg: '#F5F5F5', color: '#333333', label: 'Alert' };
        }
    },

    async handleAlertClick(id) {
        try {
            await ApiService.markAlertRead(id);
            this.loadAndRender();
        } catch (e) {
            console.warn('Failed to mark alert as read on API:', e.message);
            if (window.AppData && AppData.alerts) {
                const a = AppData.alerts.find(item => item.id === parseInt(id));
                if (a) a.unread = false;
            }
            this.loadAndRender();
        }
    },

    async markAllAsRead() {
        try {
            if (window.AppData && AppData.alerts) {
                // Call mark read for all unread alerts
                const unreadAlerts = AppData.alerts.filter(a => a.unread);
                await Promise.all(unreadAlerts.map(a => ApiService.markAlertRead(a.id)));
            }
        } catch (e) {
            console.warn('Failed to mark all alerts as read on API:', e.message);
            if (window.AppData && AppData.alerts) {
                AppData.alerts.forEach(a => a.unread = false);
            }
        }
        this.loadAndRender();
    },

    async loadAndRender() {
        let items = [];
        try {
            items = await ApiService.getAlerts(this.activeFilter);
        } catch (err) {
            console.warn('API error fetching alerts, showing local:', err.message);
            items = (window.AppData && AppData.alerts) || [];
            
            if (this.activeFilter !== 'All') {
                items = items.filter(item => {
                    if (this.activeFilter === 'Notices') return item.type === 'notice';
                    if (this.activeFilter === 'Smart Alerts') return item.category === 'Smart Alerts'; 
                    if (this.activeFilter === 'Updates') return item.category === 'Updates';
                    return true;
                });
            }
        }
        this.renderUI(items);
    },

    render() {
        this.loadAndRender();
    },

    renderUI(items) {
        const container = document.getElementById('page-content');
        
        // Group items into Unread and Earlier
        const unreadItems = items.filter(item => item.unread);
        const earlierItems = items.filter(item => !item.unread);

        const renderAlertCard = (alert) => {
            const colors = this.getServiceStyle(alert.type);
            const dotColor = alert.unread ? '#326DF0' : '#8A98AD';
            const borderStyle = alert.unread ? 'border-left: 4px solid var(--primary);' : 'border-left: 1px solid var(--border);';
            const opacityStyle = alert.unread ? '' : 'opacity: 0.85;';
            
            return `
                <div class="app-card alert-item" onclick="AlertsPage.handleAlertClick(${alert.id})" style="cursor: pointer; display: flex; gap: var(--sp-md); transition: var(--transition-fast); margin-bottom: var(--sp-md); ${borderStyle} ${opacityStyle}">
                    <div class="alert-icon-circle icon-circle" style="background-color: ${colors.bg}; color: ${colors.color}; flex-shrink: 0; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="${this.getAlertIcon(alert.type)}" style="width: 20px; height: 20px;"></i>
                    </div>
                    <div style="flex: 1;">
                        <!-- Header row inside card -->
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--sp-xs);">
                            <span style="font-size: var(--fs-caption); font-weight: 700; color: ${colors.color}; text-transform: uppercase; letter-spacing: 0.5px;">${colors.label}</span>
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <span style="font-size: var(--fs-caption); color: var(--text-tertiary);">${alert.time}</span>
                                <div style="width: 6px; height: 6px; border-radius: 50%; background-color: ${dotColor};"></div>
                            </div>
                        </div>
                        <div class="alert-title card-heading" style="font-weight: 700; font-size: var(--fs-card-heading); color: var(--text-primary); margin-top: 2px;">${alert.title}</div>
                        <div class="alert-message body-text-secondary" style="font-size: var(--fs-body); color: var(--text-secondary); margin-top: 4px; line-height: 1.4;">${alert.message}</div>
                    </div>
                </div>
            `;
        };

        let unreadSectionHtml = '';
        if (unreadItems.length > 0) {
            unreadSectionHtml = `
                <div style="margin-top: var(--sp-xl); margin-bottom: var(--sp-xxl);">
                    <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--sp-md);">
                        <h2 style="font-size: 20px; font-weight: 700; color: var(--text-primary); margin: 0;">Unread</h2>
                        <span class="view-all" onclick="AlertsPage.markAllAsRead()" style="color: var(--primary); font-size: var(--fs-body); font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: var(--sp-xs);">
                            <i data-lucide="check-check" style="width: 16px; height: 16px;"></i> Mark all as read
                        </span>
                    </div>
                    <div class="alert-list">
                        ${unreadItems.map(renderAlertCard).join('')}
                    </div>
                </div>
            `;
        }

        let earlierSectionHtml = '';
        if (earlierItems.length > 0) {
            earlierSectionHtml = `
                <div style="margin-top: var(--sp-xl);">
                    <div class="section-header" style="margin-bottom: var(--sp-md);">
                        <h2 style="font-size: 20px; font-weight: 700; color: var(--text-primary); margin: 0;">Earlier</h2>
                    </div>
                    <div class="alert-list">
                        ${earlierItems.map(renderAlertCard).join('')}
                    </div>
                </div>
            `;
        }

        let mainHtml = '';
        if (unreadItems.length === 0 && earlierItems.length === 0) {
            mainHtml = `
              <div style="text-align: center; padding: 64px 16px; color: var(--text-tertiary);">
                <i data-lucide="bell" style="width: 48px; height: 48px; margin-bottom: 12px; stroke-width: 1.5;"></i>
                <div style="font-size: var(--fs-body); color: var(--text-secondary);">No alerts right now.</div>
              </div>
            `;
        } else {
            mainHtml = `
                ${unreadSectionHtml}
                ${earlierSectionHtml}
            `;
        }

        let html = `
            <div style="padding: var(--sp-md) var(--page-padding) var(--sp-xxxl);">
                
                <div class="alerts-tabs" style="margin-top: var(--sp-md); margin-bottom: var(--sp-xl); overflow-x: auto; white-space: nowrap; display: flex; gap: var(--sp-sm); scrollbar-width: none;">
                    ${['All', 'Smart Alerts', 'Notices', 'Updates'].map(filter => 
                        `<div class="chip ${this.activeFilter === filter ? 'active' : ''}" onclick="AlertsPage.setFilter('${filter}')">${filter}</div>`
                    ).join('')}
                </div>
                
                ${mainHtml}
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

window.AlertsPage = AlertsPage;
