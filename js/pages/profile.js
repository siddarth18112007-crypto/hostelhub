const ProfilePage = {
    async loadAndRender() {
        let student = null;
        try {
            student = await ApiService.getProfile();
        } catch (e) {
            console.warn('API error fetching profile, loading local:', e.message);
            student = (window.AppData && AppData.student) || {
                name: 'Sid',
                id: 'STU1024',
                course: 'B.Tech Computer Science',
                batch: '2024–2028',
                block: 'B',
                room: '304',
                floor: '3rd Floor',
                roommates: 2
            };
        }
        this.renderUI(student);
    },

    render() {
        this.loadAndRender();
    },

    renderUI(student) {
        const container = document.getElementById('page-content');
        if (!container) return;

        const avatarInitial = student && student.name ? student.name.charAt(0) : 'S';
        const name = student ? student.name : 'Sid';
        const id = student ? student.student_id || student.id : 'STU1024';
        const course = student ? student.course : 'B.Tech CS';
        const batch = student ? student.batch : '2024–2028';
        const block = student ? student.block : 'B';
        const room = student ? student.room : '304';
        const floor = student ? student.floor : '3rd Floor';
        const roommatesCount = student ? student.roommates : 2;

        container.innerHTML = `
            <div style="padding: var(--sp-xl) var(--page-padding) var(--sp-xxxl);">
                <div class="profile-header-section" style="padding-top: 0;">
                    <div class="profile-avatar">${avatarInitial}</div>
                    <div class="profile-name" style="font-size: var(--fs-section); font-weight: var(--fw-bold); color: var(--text-primary); margin-top: var(--sp-md);">${name}</div>
                    <div class="profile-id" style="font-size: var(--fs-small); color: var(--text-secondary); margin-top: 2px;">${id}</div>
                </div>

                <div class="profile-info-grid" style="margin-top: var(--sp-xl);">
                    <div class="profile-info-card app-card">
                        <div class="label" style="font-size: var(--fs-caption); color: var(--text-tertiary); margin-bottom: 4px;">Course</div>
                        <div class="value" style="font-size: var(--fs-body); font-weight: var(--fw-semibold); color: var(--text-primary);">${course}</div>
                    </div>
                    <div class="profile-info-card app-card">
                        <div class="label" style="font-size: var(--fs-caption); color: var(--text-tertiary); margin-bottom: 4px;">Batch</div>
                        <div class="value" style="font-size: var(--fs-body); font-weight: var(--fw-semibold); color: var(--text-primary);">${batch}</div>
                    </div>
                    <div class="profile-info-card app-card">
                        <div class="label" style="font-size: var(--fs-caption); color: var(--text-tertiary); margin-bottom: 4px;">Block</div>
                        <div class="value" style="font-size: var(--fs-body); font-weight: var(--fw-semibold); color: var(--text-primary);">${block}</div>
                    </div>
                    <div class="profile-info-card app-card">
                        <div class="label" style="font-size: var(--fs-caption); color: var(--text-tertiary); margin-bottom: 4px;">Room</div>
                        <div class="value" style="font-size: var(--fs-body); font-weight: var(--fw-semibold); color: var(--text-primary);">${room}</div>
                    </div>
                    <div class="profile-info-card app-card">
                        <div class="label" style="font-size: var(--fs-caption); color: var(--text-tertiary); margin-bottom: 4px;">Floor</div>
                        <div class="value" style="font-size: var(--fs-body); font-weight: var(--fw-semibold); color: var(--text-primary);">${floor}</div>
                    </div>
                    <div class="profile-info-card app-card">
                        <div class="label" style="font-size: var(--fs-caption); color: var(--text-tertiary); margin-bottom: 4px;">Roommates</div>
                        <div class="value" style="font-size: var(--fs-body); font-weight: var(--fw-semibold); color: var(--text-primary);">${roommatesCount}</div>
                    </div>
                </div>

                <!-- Account Section -->
                <div class="profile-menu-section" style="margin-top: var(--sp-xxl);">
                    <div class="section-title" style="font-size: var(--fs-caption); font-weight: var(--fw-semibold); color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: var(--sp-sm);">Account</div>
                    <div class="app-card" style="padding: 0; overflow: hidden;">
                        <div class="profile-menu-item" onclick="Router.navigate('profile')" style="padding: 1.25rem 1rem; border-bottom: 1px solid var(--divider); display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: var(--sp-md);">
                                <i data-lucide="user" style="color: var(--primary); width: 20px; height: 20px;"></i>
                                <span style="font-weight: 500; font-size: 1rem; color: var(--text-primary);">My Profile</span>
                            </div>
                            <i data-lucide="chevron-right" style="color: var(--text-tertiary); width: 18px; height: 18px;"></i>
                        </div>
                        <div class="profile-menu-item" onclick="Router.navigate('room')" style="padding: 1.25rem 1rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: var(--sp-md);">
                                <i data-lucide="building-2" style="color: var(--primary); width: 20px; height: 20px;"></i>
                                <span style="font-weight: 500; font-size: 1rem; color: var(--text-primary);">My Hostel Details</span>
                            </div>
                            <i data-lucide="chevron-right" style="color: var(--text-tertiary); width: 18px; height: 18px;"></i>
                        </div>
                    </div>
                </div>

                <!-- Preferences Section -->
                <div class="profile-menu-section" style="margin-top: var(--sp-xl);">
                    <div class="section-title" style="font-size: var(--fs-caption); font-weight: var(--fw-semibold); color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: var(--sp-sm);">Preferences</div>
                    <div class="app-card" style="padding: 0; overflow: hidden;">
                        <div class="profile-menu-item" onclick="Router.navigate('settings')" style="padding: 1.25rem 1rem; border-bottom: 1px solid var(--divider); display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: var(--sp-md);">
                                <i data-lucide="settings" style="color: var(--primary); width: 20px; height: 20px;"></i>
                                <span style="font-weight: 500; font-size: 1rem; color: var(--text-primary);">Settings</span>
                            </div>
                            <i data-lucide="chevron-right" style="color: var(--text-tertiary); width: 18px; height: 18px;"></i>
                        </div>
                        <div class="profile-menu-item" onclick="Router.navigate('notification-prefs')" style="padding: 1.25rem 1rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: var(--sp-md);">
                                <i data-lucide="bell-ring" style="color: var(--primary); width: 20px; height: 20px;"></i>
                                <span style="font-weight: 500; font-size: 1rem; color: var(--text-primary);">Notification Preferences</span>
                            </div>
                            <i data-lucide="chevron-right" style="color: var(--text-tertiary); width: 18px; height: 18px;"></i>
                        </div>
                    </div>
                </div>

                <!-- Support Section -->
                <div class="profile-menu-section" style="margin-top: var(--sp-xl);">
                    <div class="section-title" style="font-size: var(--fs-caption); font-weight: var(--fw-semibold); color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: var(--sp-sm);">Support</div>
                    <div class="app-card" style="padding: 0; overflow: hidden;">
                        <div class="profile-menu-item" onclick="Router.navigate('help')" style="padding: 1.25rem 1rem; border-bottom: 1px solid var(--divider); display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: var(--sp-md);">
                                <i data-lucide="help-circle" style="color: var(--primary); width: 20px; height: 20px;"></i>
                                <span style="font-weight: 500; font-size: 1rem; color: var(--text-primary);">Help & Support</span>
                            </div>
                            <i data-lucide="chevron-right" style="color: var(--text-tertiary); width: 18px; height: 18px;"></i>
                        </div>
                        <div class="profile-menu-item" onclick="Router.navigate('report')" style="padding: 1.25rem 1rem; border-bottom: 1px solid var(--divider); display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: var(--sp-md);">
                                <i data-lucide="flag" style="color: var(--primary); width: 20px; height: 20px;"></i>
                                <span style="font-weight: 500; font-size: 1rem; color: var(--text-primary);">Report a Problem</span>
                            </div>
                            <i data-lucide="chevron-right" style="color: var(--text-tertiary); width: 18px; height: 18px;"></i>
                        </div>
                        <div class="profile-menu-item" onclick="Router.navigate('about')" style="padding: 1.25rem 1rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                            <div style="display: flex; align-items: center; gap: var(--sp-md);">
                                <i data-lucide="info" style="color: var(--primary); width: 20px; height: 20px;"></i>
                                <span style="font-weight: 500; font-size: 1rem; color: var(--text-primary);">About HostelHub</span>
                            </div>
                            <i data-lucide="chevron-right" style="color: var(--text-tertiary); width: 18px; height: 18px;"></i>
                        </div>
                    </div>
                </div>

                <!-- Logout Button -->
                <div class="app-card" style="padding: 0; overflow: hidden; margin-top: var(--sp-xl);">
                    <div class="profile-menu-item" onclick="ApiService.setToken(null); Router.navigate('login')" style="padding: 1.25rem 1rem; display: flex; align-items: center; gap: var(--sp-md); cursor: pointer; color: var(--error);">
                        <i data-lucide="log-out" style="color: var(--error); width: 20px; height: 20px;"></i>
                        <span style="font-weight: 600; font-size: 1rem;">Log Out</span>
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
