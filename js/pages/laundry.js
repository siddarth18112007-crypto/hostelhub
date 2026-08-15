window.LaundryPage = {
    isBooking: false,

    async bookSlot() {
        const date = document.getElementById('laundry-date').value;
        const time = document.getElementById('laundry-time').value;
        const machine = document.getElementById('laundry-machine').value;

        if (!date || !time || !machine) {
            alert('Please select all booking options');
            return;
        }

        try {
            await ApiService.bookLaundrySlot(date, time, machine);
            alert('Slot booked successfully!');
            this.isBooking = false;
            this.loadAndRender();
        } catch (e) {
            console.warn('Booking failed on server, adding locally:', e.message);
            // Fallback: local add
            if (window.AppData) {
                AppData.laundrySlots.push({ date, time, machine, status: 'Booked' });
                // Add to schedule
                AppData.todaySchedule.push({
                    time: time.split(' – ')[0],
                    endTime: time.split(' – ')[1] || '',
                    title: 'Laundry Slot',
                    category: 'Laundry',
                    location: 'Block B Laundry',
                    type: 'laundry',
                    status: 'Scheduled',
                    day: date.toLowerCase()
                });
            }
            alert('Slot booked successfully (Static Mode)!');
            this.isBooking = false;
            this.loadAndRender();
        }
    },

    toggleBookingView() {
        this.isBooking = !this.isBooking;
        this.loadAndRender();
    },

    async loadAndRender() {
        let slots = [];
        let history = [];
        try {
            slots = await ApiService.getLaundrySlots();
            history = await ApiService.getLaundryHistory();
        } catch (e) {
            console.warn('API error fetching laundry lists, showing local:', e.message);
            slots = (window.AppData && AppData.laundrySlots) || [];
            history = (window.AppData && AppData.laundryHistory) || [];
        }
        this.renderUI(slots, history);
    },

    render() {
        this.loadAndRender();
    },

    renderUI(slots, history) {
        const container = document.getElementById('page-content');
        
        let upcomingHtml = '';
        if (slots.length === 0) {
            upcomingHtml = '<div style="text-align: center; color: var(--text-tertiary); padding: 16px;">No upcoming slots</div>';
        } else {
            upcomingHtml = slots.map(slot => `
                <div class="app-card slot-card" style="margin-bottom: var(--sp-md);">
                    <div>
                        <div style="font-weight: 600; color: var(--text-primary);">${slot.date}</div>
                        <div style="font-size: var(--fs-small); color: var(--text-secondary); margin-top: 4px;">${slot.time} · ${slot.machine}</div>
                    </div>
                    <span class="status-badge badge-success">${slot.status}</span>
                </div>
            `).join('');
        }
        
        let historyHtml = '';
        if (history.length === 0) {
            historyHtml = '<div style="text-align: center; color: var(--text-tertiary); padding: 16px;">No history available</div>';
        } else {
            historyHtml = history.map(slot => `
                <div class="app-card slot-card" style="margin-bottom: var(--sp-md); opacity: 0.85;">
                    <div>
                        <div style="font-weight: 600; color: var(--text-primary);">${slot.date}</div>
                        <div style="font-size: var(--fs-small); color: var(--text-secondary); margin-top: 4px;">${slot.time} · ${slot.machine}</div>
                    </div>
                    <span class="status-badge" style="background-color: var(--border); color: var(--text-secondary);">${slot.status}</span>
                </div>
            `).join('');
        }

        let mainContentHtml = '';

        if (this.isBooking) {
            mainContentHtml = `
                <div class="app-card">
                    <h3 style="font-size: var(--fs-card-heading); font-weight: 600; margin-bottom: var(--sp-lg);">Book a Laundry Slot</h3>
                    
                    <div class="input-group">
                        <label for="laundry-date">Select Date</label>
                        <select id="laundry-date" class="input-field">
                            <option value="Tomorrow">Tomorrow</option>
                            <option value="Friday">Friday</option>
                        </select>
                    </div>

                    <div class="input-group" style="margin-top: var(--sp-md);">
                        <label for="laundry-time">Select Time Slot</label>
                        <select id="laundry-time" class="input-field">
                            <option value="10:00 AM – 11:00 AM">10:00 AM – 11:00 AM</option>
                            <option value="02:00 PM – 03:00 PM">02:00 PM – 03:00 PM</option>
                            <option value="05:00 PM – 06:00 PM">05:00 PM – 06:00 PM</option>
                        </select>
                    </div>

                    <div class="input-group" style="margin-top: var(--sp-md);">
                        <label for="laundry-machine">Select Machine</label>
                        <select id="laundry-machine" class="input-field">
                            <option value="Machine 1">Machine 1</option>
                            <option value="Machine 2">Machine 2</option>
                            <option value="Machine 3">Machine 3</option>
                        </select>
                    </div>

                    <div style="display: flex; gap: var(--sp-md); margin-top: 24px;">
                        <button class="btn-secondary" onclick="LaundryPage.toggleBookingView()" style="flex: 1;">Cancel</button>
                        <button class="btn-primary" onclick="LaundryPage.bookSlot()" style="flex: 1;">Book Slot</button>
                    </div>
                </div>
            `;
        } else {
            mainContentHtml = `
                <div class="section-header">
                    <h2>Upcoming Slots</h2>
                    <span class="view-all" onclick="LaundryPage.toggleBookingView()">+ Book New</span>
                </div>
                <div class="upcoming-list" style="margin-bottom: var(--sp-xxl);">
                    ${upcomingHtml}
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
                    <h1 style="font-size: var(--fs-page-title); font-weight: var(--fw-bold); margin: 0;">Laundry</h1>
                </div>
                
                <div class="service-page-hero" style="background-color: var(--laundry-bg); color: var(--laundry-icon);">
                    <div style="background: white; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-card);">
                        <i data-lucide="washing-machine" style="width: 24px; height: 24px; color: var(--laundry-icon);"></i>
                    </div>
                    <div>
                        <h2 style="font-size: var(--fs-section); font-weight: 700; margin: 0;">Laundry Manager</h2>
                        <div style="font-size: var(--fs-small); opacity: 0.8; margin-top: 2px;">Book machines & track cycles</div>
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
