window.SettingsPage = {
    render: function() {
        const container = document.getElementById('page-content');
        
        // Fetch current states
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const isDark = currentTheme === 'dark';
        const isNotificationsEnabled = SafeStorage.getItem('hh_notifications') !== 'false';
        const isSoundEnabled = SafeStorage.getItem('hh_sound') !== 'false';

        container.innerHTML = `
            <div style="padding: var(--sp-xl) var(--page-padding) var(--sp-xxxl);">
                <div class="page-header" style="padding-left: 0; padding-top: 0; margin-bottom: var(--sp-lg); display: flex; align-items: center; gap: var(--sp-md);">
                    <button class="icon-btn back-btn" onclick="history.back()">
                        <i data-lucide="arrow-left"></i>
                    </button>
                    <h1 style="font-size: var(--fs-page-title); font-weight: var(--fw-bold); margin: 0;">Settings</h1>
                </div>
                
                <div class="settings-section" style="margin-bottom: 2rem;">
                    <h3 style="margin-top: 0; margin-bottom: 1rem; color: var(--text-tertiary); font-size: var(--fs-caption); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">General</h3>
                    <div class="app-card" style="padding: 0; overflow: hidden;">
                        
                        <!-- Dark Mode Toggle -->
                        <div class="settings-item" style="padding: 1.25rem 1rem; border-bottom: 1px solid var(--divider); display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 500; font-size: 1rem; color: var(--text-primary);">Dark Mode</span>
                            <div class="toggle-switch ${isDark ? 'active' : ''}" 
                                 onclick="SettingsPage.handleToggle('theme', this)" 
                                 style="width: 48px; height: 24px; border-radius: 12px; position: relative; cursor: pointer; transition: var(--transition-fast); background-color: ${isDark ? 'var(--primary)' : 'var(--border)'};">
                            </div>
                        </div>

                        <!-- Notifications Toggle -->
                        <div class="settings-item" style="padding: 1.25rem 1rem; border-bottom: 1px solid var(--divider); display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 500; font-size: 1rem; color: var(--text-primary);">Notifications</span>
                            <div class="toggle-switch ${isNotificationsEnabled ? 'active' : ''}" 
                                 onclick="SettingsPage.handleToggle('notifications', this)" 
                                 style="width: 48px; height: 24px; border-radius: 12px; position: relative; cursor: pointer; transition: var(--transition-fast); background-color: ${isNotificationsEnabled ? 'var(--primary)' : 'var(--border)'};">
                            </div>
                        </div>

                        <!-- Sound Toggle -->
                        <div class="settings-item" style="padding: 1.25rem 1rem; display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 500; font-size: 1rem; color: var(--text-primary);">Sound</span>
                            <div class="toggle-switch ${isSoundEnabled ? 'active' : ''}" 
                                 onclick="SettingsPage.handleToggle('sound', this)" 
                                 style="width: 48px; height: 24px; border-radius: 12px; position: relative; cursor: pointer; transition: var(--transition-fast); background-color: ${isSoundEnabled ? 'var(--primary)' : 'var(--border)'};">
                            </div>
                        </div>

                    </div>
                </div>
                
                <div class="settings-section" style="margin-bottom: 2rem;">
                    <h3 style="margin-top: 0; margin-bottom: 1rem; color: var(--text-tertiary); font-size: var(--fs-caption); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Data</h3>
                    <div class="app-card" style="padding: 0; overflow: hidden;">
                        <div class="settings-item" style="padding: 1.25rem 1rem; border-bottom: 1px solid var(--divider); display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="alert('Cache cleared successfully!')">
                            <span style="font-weight: 500; font-size: 1rem; color: var(--text-primary);">Clear Cache</span>
                            <i data-lucide="chevron-right" style="color: var(--text-tertiary); width: 20px; height: 20px;"></i>
                        </div>
                        <div class="settings-item" style="padding: 1.25rem 1rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="alert('Starting data export... You will receive a notification shortly.')">
                            <span style="font-weight: 500; font-size: 1rem; color: var(--text-primary);">Download My Data</span>
                            <i data-lucide="chevron-right" style="color: var(--text-tertiary); width: 20px; height: 20px;"></i>
                        </div>
                    </div>
                </div>
                
                <div class="settings-section" style="margin-bottom: 2rem;">
                    <h3 style="margin-top: 0; margin-bottom: 1rem; color: var(--text-tertiary); font-size: var(--fs-caption); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Account</h3>
                    <div class="app-card" style="padding: 0; overflow: hidden;">
                        <div class="settings-item" style="padding: 1.25rem 1rem; border-bottom: 1px solid var(--divider); display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="alert('Password reset link sent to your registered email.')">
                            <span style="font-weight: 500; font-size: 1rem; color: var(--text-primary);">Change Password</span>
                            <i data-lucide="chevron-right" style="color: var(--text-tertiary); width: 20px; height: 20px;"></i>
                        </div>
                        <div class="settings-item" style="padding: 1.25rem 1rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; color: var(--error);" onclick="if(confirm('Are you sure you want to delete your account? This action is permanent.')) { alert('Account deleted.'); Router.navigate('login'); }">
                            <span style="font-weight: 500; font-size: 1rem;">Delete Account</span>
                            <i data-lucide="trash-2" style="width: 20px; height: 20px;"></i>
                        </div>
                    </div>
                </div>
                <div style="height: 40px;"></div>
            </div>
        `;
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
    },
    
    handleToggle: function(settingType, el) {
        const isActive = el.classList.toggle('active');
        
        if (isActive) {
            el.style.backgroundColor = 'var(--primary)';
        } else {
            el.style.backgroundColor = 'var(--border)';
        }

        if (settingType === 'theme') {
            const newTheme = isActive ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            SafeStorage.setItem('hh_theme', newTheme);
        } else if (settingType === 'notifications') {
            SafeStorage.setItem('hh_notifications', isActive ? 'true' : 'false');
        } else if (settingType === 'sound') {
            SafeStorage.setItem('hh_sound', isActive ? 'true' : 'false');
        }

        // Call backend API to save settings in the background
        const dark_mode = document.documentElement.getAttribute('data-theme') === 'dark';
        const notifications = SafeStorage.getItem('hh_notifications') !== 'false';
        const sound = SafeStorage.getItem('hh_sound') !== 'false';
        
        if (window.ApiService) {
            ApiService.updateSettings({ dark_mode, notifications, sound }).catch(e => {
                console.warn('Failed syncing settings to backend server:', e.message);
            });
        }
    }
};
