window.NotificationPrefsPage = {
    async loadAndRender() {
        let prefs = {
            mess_updates: 1,
            laundry_reminders: 1,
            repair_updates: 1,
            event_reminders: 1,
            notices: 1,
            smart_alerts: 1
        };

        try {
            prefs = await ApiService.getPreferences();
        } catch (e) {
            console.warn('API error fetching notification preferences, loading from local state:', e.message);
            // Fallback to local storage
            prefs = {
                mess_updates: SafeStorage.getItem('pref_mess') !== 'false' ? 1 : 0,
                laundry_reminders: SafeStorage.getItem('pref_laundry') !== 'false' ? 1 : 0,
                repair_updates: SafeStorage.getItem('pref_repair') !== 'false' ? 1 : 0,
                event_reminders: SafeStorage.getItem('pref_events') !== 'false' ? 1 : 0,
                notices: SafeStorage.getItem('pref_notices') !== 'false' ? 1 : 0,
                smart_alerts: SafeStorage.getItem('pref_smart') !== 'false' ? 1 : 0
            };
        }

        this.renderUI(prefs);
    },

    render() {
        this.loadAndRender();
    },

    renderUI(prefs) {
        const container = document.getElementById('page-content');
        
        const fields = [
            { key: 'mess_updates', label: 'Mess Updates', localKey: 'pref_mess' },
            { key: 'laundry_reminders', label: 'Laundry Reminders', localKey: 'pref_laundry' },
            { key: 'repair_updates', label: 'Repair Updates', localKey: 'pref_repair' },
            { key: 'event_reminders', label: 'Event Reminders', localKey: 'pref_events' },
            { key: 'notices', label: 'Notices', localKey: 'pref_notices' },
            { key: 'smart_alerts', label: 'Smart Alerts', localKey: 'pref_smart' }
        ];
        
        const prefsHtml = fields.map((field, i) => {
            const isActive = prefs[field.key] === 1;
            return `
                <div class="settings-item" style="padding: 1.25rem 1rem; border-bottom: ${i === fields.length - 1 ? 'none' : '1px solid var(--divider)'}; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 500; font-size: 1rem; color: var(--text-primary);">${field.label}</span>
                    <div class="toggle-switch ${isActive ? 'active' : ''}" 
                         onclick="NotificationPrefsPage.handleToggle('${field.key}', '${field.localKey}', this)" 
                         style="width: 48px; height: 24px; border-radius: 12px; position: relative; cursor: pointer; transition: var(--transition-fast); background-color: ${isActive ? 'var(--primary)' : 'var(--border)'};">
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div style="padding: var(--sp-xl) var(--page-padding) var(--sp-xxxl);">
                <div class="page-header" style="padding-left: 0; padding-top: 0; margin-bottom: var(--sp-lg); display: flex; align-items: center; gap: var(--sp-md);">
                    <button class="icon-btn back-btn" onclick="history.back()">
                        <i data-lucide="arrow-left"></i>
                    </button>
                    <h1 style="font-size: var(--fs-page-title); font-weight: var(--fw-bold); margin: 0;">Notification Preferences</h1>
                </div>
                
                <div class="app-card" style="padding: 0; overflow: hidden; margin-bottom: 2rem;">
                    ${prefsHtml}
                </div>
                <div style="height: 40px;"></div>
            </div>
        `;
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
    },
    
    async handleToggle(fieldKey, localKey, el) {
        const isActive = el.classList.toggle('active');
        
        if (isActive) {
            el.style.backgroundColor = 'var(--primary)';
        } else {
            el.style.backgroundColor = 'var(--border)';
        }

        // Save to local storage
        SafeStorage.setItem(localKey, isActive ? 'true' : 'false');

        // Sync with API
        try {
            const currentPrefs = {
                mess_updates: SafeStorage.getItem('pref_mess') !== 'false' ? 1 : 0,
                laundry_reminders: SafeStorage.getItem('pref_laundry') !== 'false' ? 1 : 0,
                repair_updates: SafeStorage.getItem('pref_repair') !== 'false' ? 1 : 0,
                event_reminders: SafeStorage.getItem('pref_events') !== 'false' ? 1 : 0,
                notices: SafeStorage.getItem('pref_notices') !== 'false' ? 1 : 0,
                smart_alerts: SafeStorage.getItem('pref_smart') !== 'false' ? 1 : 0
            };
            await ApiService.updatePreferences(currentPrefs);
        } catch (e) {
            console.warn('Failed syncing preferences to backend server:', e.message);
        }
    }
};
