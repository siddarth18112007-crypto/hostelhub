window.ResourcesPage = {
    async loadAndRender() {
        let list = [];
        try {
            list = await ApiService.getResources();
        } catch (e) {
            console.warn('API error fetching resources, loading local:', e.message);
            list = (window.AppData && AppData.resources) || [];
        }
        this.renderUI(list);
    },

    render() {
        this.loadAndRender();
    },

    renderUI(list) {
        const container = document.getElementById('page-content');
        
        let gridHtml = '';
        if (list.length === 0) {
            gridHtml = '<p style="color: var(--text-tertiary); grid-column: 1/-1; text-align: center; padding: 16px;">No resources available</p>';
        } else {
            gridHtml = list.map(res => {
                const availabilityText = res.available ? 'Available' : 'Unavailable';
                const availabilityClass = res.available ? 'badge-success' : 'badge-error';
                return `
                    <div class="app-card resource-item" style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: var(--sp-lg) var(--sp-sm);">
                        <div style="background: var(--resources-bg); color: var(--resources-icon); width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: var(--sp-md);">
                            <i data-lucide="${res.icon || 'file-text'}" style="width: 20px; height: 20px;"></i>
                        </div>
                        <h4 style="margin: 0; font-size: var(--fs-body); font-weight: 600; color: var(--text-primary);">${res.name}</h4>
                        <p style="color: var(--text-secondary); font-size: var(--fs-caption); margin: var(--sp-xs) 0 var(--sp-md); line-height: 1.4; flex-grow: 1;">${res.desc}</p>
                        <span class="status-badge ${availabilityClass}">${availabilityText}</span>
                    </div>
                `;
            }).join('');
        }

        container.innerHTML = `
            <div style="padding: var(--sp-xl) var(--page-padding) var(--sp-xxxl);">
                <div class="page-header" style="padding-left: 0; padding-top: 0; margin-bottom: var(--sp-lg); display: flex; align-items: center; gap: var(--sp-md);">
                    <button class="icon-btn back-btn" onclick="history.back()">
                        <i data-lucide="arrow-left"></i>
                    </button>
                    <h1 style="font-size: var(--fs-page-title); font-weight: var(--fw-bold); margin: 0;">Resources</h1>
                </div>
                
                <div class="service-page-hero" style="background-color: var(--resources-bg); color: var(--resources-icon);">
                    <div style="background: white; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-card);">
                        <i data-lucide="library" style="width: 24px; height: 24px; color: var(--resources-icon);"></i>
                    </div>
                    <div>
                        <h2 style="font-size: var(--fs-section); font-weight: 700; margin: 0;">Resources</h2>
                        <div style="font-size: var(--fs-small); opacity: 0.8; margin-top: 2px;">Shared facilities & utilities details</div>
                    </div>
                </div>
                
                <div class="resource-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-md); margin-bottom: 2rem;">
                    ${gridHtml}
                </div>
                <div style="height: 40px;"></div>
            </div>
        `;
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
};
