window.RoomPage = {
    async loadAndRender() {
        let profile = null;
        try {
            profile = await ApiService.getProfile();
        } catch (e) {
            console.warn('API error fetching room details, loading local:', e.message);
            profile = (window.AppData && AppData.student) || null;
            if (profile) {
                profile.roommatesList = (window.AppData && AppData.roommates) || [];
                profile.amenities = (window.AppData && AppData.roomAmenities) || [];
            }
        }
        this.renderUI(profile);
    },

    render() {
        this.loadAndRender();
    },

    renderUI(profile) {
        const container = document.getElementById('page-content');
        
        let roommatesHtml = '';
        const list = profile ? (profile.roommatesList || []) : [];
        if (list.length === 0) {
            roommatesHtml = '<div style="color: var(--text-tertiary); padding: 12px 0;">No roommates details available</div>';
        } else {
            roommatesHtml = list.map(rm => `
                <div class="detail-row" style="display: flex; justify-content: space-between; align-items: center; padding: var(--sp-md) 0; border-bottom: 1px solid var(--divider);">
                    <div>
                        <strong style="display: block; font-size: var(--fs-body); color: var(--text-primary);">${rm.name}</strong>
                        <span style="font-size: var(--fs-small); color: var(--text-secondary);">${rm.id}</span>
                    </div>
                </div>
            `).join('');
        }

        let amenitiesHtml = '';
        const amList = profile ? (profile.amenities || []) : [];
        if (amList.length === 0) {
            amenitiesHtml = '<div style="color: var(--text-tertiary); padding: 12px 0;">No amenities details available</div>';
        } else {
            amenitiesHtml = amList.map(am => `
                <div style="display: flex; align-items: center; gap: var(--sp-sm); margin-bottom: var(--sp-sm); font-size: var(--fs-body); color: var(--text-primary);">
                    <i data-lucide="check" style="color: var(--success); width: 16px; height: 16px; flex-shrink: 0;"></i>
                    <span>${am}</span>
                </div>
            `).join('');
        }

        const block = profile ? profile.block : 'B';
        const room = profile ? profile.room : '304';
        const floor = profile ? profile.floor : '3rd Floor';
        const roommatesCount = profile ? profile.roommates : 2;

        container.innerHTML = `
            <div style="padding: var(--sp-xl) var(--page-padding) var(--sp-xxxl);">
                <div class="page-header" style="padding-left: 0; padding-top: 0; margin-bottom: var(--sp-lg); display: flex; align-items: center; gap: var(--sp-md);">
                    <button class="icon-btn back-btn" onclick="history.back()">
                        <i data-lucide="arrow-left"></i>
                    </button>
                    <h1 style="font-size: var(--fs-page-title); font-weight: var(--fw-bold); margin: 0;">Room Details</h1>
                </div>
                
                <div class="service-page-hero" style="background-color: var(--room-bg); color: var(--room-icon);">
                    <div style="background: white; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-card);">
                        <i data-lucide="bed-double" style="width: 24px; height: 24px; color: var(--room-icon);"></i>
                    </div>
                    <div>
                        <h2 style="font-size: var(--fs-section); font-weight: 700; margin: 0;">Room Details</h2>
                        <div style="font-size: var(--fs-small); opacity: 0.8; margin-top: 2px;">Your hostel living space details</div>
                    </div>
                </div>
                
                <div class="app-card" style="margin-bottom: var(--sp-xl);">
                    <h3 style="margin-top: 0; margin-bottom: var(--sp-lg); font-size: var(--fs-card-heading); font-weight: 600;">Information</h3>
                    <div class="timings-list" style="display: flex; flex-direction: column; gap: var(--sp-md);">
                        <div class="detail-row" style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--divider); padding-bottom: var(--sp-sm);">
                            <span style="color: var(--text-secondary); font-size: var(--fs-body);">Block</span>
                            <strong style="color: var(--text-primary); font-size: var(--fs-body);">${block}</strong>
                        </div>
                        <div class="detail-row" style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--divider); padding-bottom: var(--sp-sm);">
                            <span style="color: var(--text-secondary); font-size: var(--fs-body);">Room</span>
                            <strong style="color: var(--text-primary); font-size: var(--fs-body);">${room}</strong>
                        </div>
                        <div class="detail-row" style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--divider); padding-bottom: var(--sp-sm);">
                            <span style="color: var(--text-secondary); font-size: var(--fs-body);">Floor</span>
                            <strong style="color: var(--text-primary); font-size: var(--fs-body);">${floor}</strong>
                        </div>
                        <div class="detail-row" style="display: flex; justify-content: space-between;">
                            <span style="color: var(--text-secondary); font-size: var(--fs-body);">Roommates</span>
                            <strong style="color: var(--text-primary); font-size: var(--fs-body);">${roommatesCount}</strong>
                        </div>
                    </div>
                </div>
                
                <div class="app-card" style="margin-bottom: var(--sp-xl);">
                    <h3 style="margin-top: 0; margin-bottom: var(--sp-lg); font-size: var(--fs-card-heading); font-weight: 600;">Roommates</h3>
                    <div class="roommates-list">
                        ${roommatesHtml}
                    </div>
                </div>
                
                <div class="app-card" style="margin-bottom: var(--sp-xl);">
                    <h3 style="margin-top: 0; margin-bottom: var(--sp-lg); font-size: var(--fs-card-heading); font-weight: 600;">Amenities</h3>
                    <div class="amenities-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-md);">
                        ${amenitiesHtml}
                    </div>
                </div>
                <div style="height: 40px;"></div>
            </div>
        `;
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
};
