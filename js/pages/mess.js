window.MessPage = {
    activeMeal: 'breakfast',

    async loadAndRender() {
        let menu = null;
        try {
            menu = await ApiService.getMessMenu();
        } catch (e) {
            console.warn('API error fetching mess menu, loading local:', e.message);
            menu = (window.AppData && AppData.messMenu) || null;
        }
        this.renderUI(menu);
    },

    switchMeal(mealName) {
        this.activeMeal = mealName.toLowerCase();
        this.loadAndRender();
    },

    render() {
        this.loadAndRender();
    },

    renderUI(menu) {
        const container = document.getElementById('page-content');
        const mealLabels = { breakfast: 'Breakfast', lunch: 'Lunch', snacks: 'Snacks', dinner: 'Dinner' };
        
        const tabsHtml = ['breakfast', 'lunch', 'snacks', 'dinner'].map(m => {
            const isActive = this.activeMeal === m;
            return `<button class="chip ${isActive ? 'active' : ''}" onclick="MessPage.switchMeal('${m}')">${mealLabels[m]}</button>`;
        }).join('');

        let mealData = { time: '', items: [] };
        if (menu && menu[this.activeMeal]) {
            mealData = menu[this.activeMeal];
        }

        const itemsHtml = (mealData.items || []).length > 0 
            ? mealData.items.map(item => `
                <li style="margin-bottom: var(--sp-md); display: flex; align-items: center; gap: var(--sp-md); font-size: var(--fs-body); color: var(--text-primary);">
                    <i data-lucide="check-circle" style="width: 18px; height: 18px; color: var(--success); flex-shrink: 0;"></i> 
                    <span>${item}</span>
                </li>
              `).join('')
            : '<li style="color: var(--text-tertiary); text-align: center; padding: 16px 0;">No items available</li>';

        container.innerHTML = `
            <div style="padding: var(--sp-xl) var(--page-padding) var(--sp-xxxl);">
                <div class="page-header" style="padding-left: 0; padding-top: 0; margin-bottom: var(--sp-lg); display: flex; align-items: center; gap: var(--sp-md);">
                    <button class="icon-btn back-btn" onclick="history.back()">
                        <i data-lucide="arrow-left"></i>
                    </button>
                    <h1 style="font-size: var(--fs-page-title); font-weight: var(--fw-bold); margin: 0;">Mess Menu</h1>
                </div>
                
                <div class="service-page-hero" style="background-color: var(--mess-bg); color: var(--mess-icon);">
                    <div style="background: white; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-card);">
                        <i data-lucide="utensils" style="width: 24px; height: 24px; color: var(--mess-icon);"></i>
                    </div>
                    <div>
                        <h2 style="font-size: var(--fs-section); font-weight: 700; margin: 0;">Mess Menu</h2>
                        <div style="font-size: var(--fs-small); opacity: 0.8; margin-top: 2px;">Daily meals & serving times</div>
                    </div>
                </div>
                
                <div class="meal-tabs" style="margin-bottom: var(--sp-lg); overflow-x: auto; white-space: nowrap; display: flex; gap: var(--sp-sm);">
                    ${tabsHtml}
                </div>
                
                <div id="meal-content">
                    <div class="app-card" style="border-left: 4px solid var(--primary);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--sp-lg);">
                            <h3 style="margin: 0; font-size: var(--fs-card-heading); font-weight: 600;">${mealLabels[this.activeMeal]}</h3>
                            <span class="status-badge" style="background-color: var(--surface-soft); color: var(--text-secondary);">${mealData.time || 'N/A'}</span>
                        </div>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            ${itemsHtml}
                        </ul>
                    </div>
                </div>
                
                <div class="app-card" style="margin-top: var(--sp-xl);">
                    <h3 style="margin-top: 0; margin-bottom: var(--sp-lg); font-size: var(--fs-card-heading); font-weight: 600;">Timings</h3>
                    <div class="timings-list" style="display: flex; flex-direction: column; gap: var(--sp-md);">
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="color: var(--text-secondary); font-size: var(--fs-body);">Breakfast</span><strong style="color: var(--text-primary); font-size: var(--fs-body);">08:00 AM - 09:00 AM</strong></div>
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="color: var(--text-secondary); font-size: var(--fs-body);">Lunch</span><strong style="color: var(--text-primary); font-size: var(--fs-body);">12:30 PM - 02:00 PM</strong></div>
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="color: var(--text-secondary); font-size: var(--fs-body);">Snacks</span><strong style="color: var(--text-primary); font-size: var(--fs-body);">04:30 PM - 05:30 PM</strong></div>
                        <div style="display: flex; justify-content: space-between; align-items: center;"><span style="color: var(--text-secondary); font-size: var(--fs-body);">Dinner</span><strong style="color: var(--text-primary); font-size: var(--fs-body);">07:30 PM - 09:00 PM</strong></div>
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
