window.EventsPage = {
    async loadAndRender() {
        let events = { upcoming: [], past: [] };
        try {
            events = await ApiService.getEvents();
        } catch (e) {
            console.warn('API error fetching events, loading local:', e.message);
            events = {
                upcoming: (window.AppData && AppData.events) || [],
                past: (window.AppData && AppData.pastEvents) || []
            };
        }
        this.renderUI(events.upcoming, events.past);
    },

    render() {
        this.loadAndRender();
    },

    renderUI(upcoming, past) {
        const container = document.getElementById('page-content');
        
        let upcomingHtml = '';
        if (upcoming.length === 0) {
            upcomingHtml = '<div style="text-align: center; color: var(--text-tertiary); padding: 16px;">No upcoming events</div>';
        } else {
            upcomingHtml = upcoming.map(ev => `
                <div class="app-card" style="margin-bottom: var(--sp-md);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--sp-sm);">
                        <h4 style="margin: 0; font-size: var(--fs-card-heading); font-weight: 600; color: var(--text-primary);">${ev.title}</h4>
                        <span class="status-badge badge-success">Upcoming</span>
                    </div>
                    <div style="font-size: var(--fs-small); color: var(--text-secondary); margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
                        <i data-lucide="calendar" style="width: 14px; height: 14px; color: var(--text-tertiary);"></i> 
                        <span>${ev.date} · ${ev.time}</span>
                    </div>
                    <div style="font-size: var(--fs-small); color: var(--text-secondary); margin-bottom: var(--sp-md); display: flex; align-items: center; gap: 4px;">
                        <i data-lucide="map-pin" style="width: 14px; height: 14px; color: var(--text-tertiary);"></i> 
                        <span>${ev.venue}</span>
                    </div>
                    <span class="status-badge" style="background-color: var(--surface-soft); color: var(--text-secondary);">${ev.type || 'Event'}</span>
                </div>
            `).join('');
        }

        let pastHtml = '';
        if (past.length === 0) {
            pastHtml = '<div style="text-align: center; color: var(--text-tertiary); padding: 16px;">No past events</div>';
        } else {
            pastHtml = past.map(ev => `
                <div class="app-card" style="margin-bottom: var(--sp-md); opacity: 0.85;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--sp-sm);">
                        <h4 style="margin: 0; font-size: var(--fs-card-heading); font-weight: 600; color: var(--text-primary);">${ev.title}</h4>
                        <span class="status-badge" style="background-color: var(--border); color: var(--text-secondary);">Completed</span>
                    </div>
                    <div style="font-size: var(--fs-small); color: var(--text-secondary); margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
                        <i data-lucide="calendar" style="width: 14px; height: 14px; color: var(--text-tertiary);"></i> 
                        <span>${ev.date} · ${ev.time}</span>
                    </div>
                    <div style="font-size: var(--fs-small); color: var(--text-secondary); margin-bottom: var(--sp-md); display: flex; align-items: center; gap: 4px;">
                        <i data-lucide="map-pin" style="width: 14px; height: 14px; color: var(--text-tertiary);"></i> 
                        <span>${ev.venue}</span>
                    </div>
                    <span class="status-badge" style="background-color: var(--surface-soft); color: var(--text-secondary);">${ev.type || 'Event'}</span>
                </div>
            `).join('');
        }

        container.innerHTML = `
            <div style="padding: var(--sp-xl) var(--page-padding) var(--sp-xxxl);">
                <div class="page-header" style="padding-left: 0; padding-top: 0; margin-bottom: var(--sp-lg); display: flex; align-items: center; gap: var(--sp-md);">
                    <button class="icon-btn back-btn" onclick="history.back()">
                        <i data-lucide="arrow-left"></i>
                    </button>
                    <h1 style="font-size: var(--fs-page-title); font-weight: var(--fw-bold); margin: 0;">Events</h1>
                </div>
                
                <div class="service-page-hero" style="background-color: var(--events-bg); color: var(--events-icon);">
                    <div style="background: white; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-card);">
                        <i data-lucide="calendar-days" style="width: 24px; height: 24px; color: var(--events-icon);"></i>
                    </div>
                    <div>
                        <h2 style="font-size: var(--fs-section); font-weight: 700; margin: 0;">Events</h2>
                        <div style="font-size: var(--fs-small); opacity: 0.8; margin-top: 2px;">Campus & hostel activities schedule</div>
                    </div>
                </div>
                
                <h3 style="margin-top: 0; margin-bottom: var(--sp-sm); font-size: var(--fs-card-heading); color: var(--text-secondary); font-weight: 600;">Upcoming Events</h3>
                <div class="upcoming-events" style="margin-bottom: var(--sp-xl);">
                    ${upcomingHtml}
                </div>
                
                <h3 style="margin-top: 0; margin-bottom: var(--sp-sm); font-size: var(--fs-card-heading); color: var(--text-secondary); font-weight: 600;">Past Events</h3>
                <div class="past-events">
                    ${pastHtml}
                </div>
                <div style="height: 40px;"></div>
            </div>
        `;
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
};
