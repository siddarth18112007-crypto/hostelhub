const HomePage = {
  activeMeal: 'lunch',
  isLoading: false,

  async loadDataAndRender() {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      const [profile, weather, menu, activeRepair, alerts, notices, upcomingEvents] = await Promise.all([
        ApiService.getProfile(),
        ApiService.getWeather(),
        ApiService.getMessMenu(),
        ApiService.getActiveRepair(),
        ApiService.getAlerts('All'),
        ApiService.getNotices(),
        ApiService.getEvents()
      ]);
      
      if (window.AppData) {
        if (profile) AppData.student = profile;
        if (weather) AppData.weather = weather;
        if (menu) AppData.messMenu = menu;
        AppData.activeRepair = activeRepair;
        if (alerts) AppData.alerts = alerts;
        if (notices && notices[0]) AppData.notice = notices[0];
        if (upcomingEvents && upcomingEvents.upcoming && upcomingEvents.upcoming[0]) {
          AppData.upcomingEvent = upcomingEvents.upcoming[0];
        }
      }
    } catch (err) {
      console.warn("Failed fetching fresh dashboard data from API, using local mock data:", err.message);
    } finally {
      this.isLoading = false;
      this.renderUI();
    }
  },

  render() {
    this.renderUI();
    this.loadDataAndRender();
  },

  renderUI() {
    const content = document.getElementById('page-content');
    const data = window.AppData || {};

    // 1. Weather Pill Style
    const weatherTemp = data.weather ? data.weather.temp : 29;
    const weatherCity = data.weather ? data.weather.city : 'Chennai';

    // 2. Room Snapshot Card (Deep Navy, White text, Outlined button)
    const block = data.student ? data.student.block : 'B';
    const room = data.student ? data.student.room : '304';
    const floor = data.student ? data.student.floor : '3rd Floor';
    const roommates = data.student ? data.student.roommates : 2;

    // 3. For You Section (Single vertical card containing items)
    let forYouHtml = '';
    const forYouItems = data.forYou || [];
    if (forYouItems.length === 0) {
      forYouHtml = '<div style="padding: var(--sp-md); color: var(--text-tertiary); font-size: var(--fs-small); text-align: center;">No items found</div>';
    } else {
      forYouHtml = `
        <div class="app-card" style="padding: 0; overflow: hidden;">
          ${forYouItems.map((item, idx) => {
            const colors = {
              laundry: { bg: '#EEF4FF', icon: '#1D43B6' },
              repair: { bg: '#FFF0F1', icon: '#E04B55' },
              mess: { bg: '#F0F6FF', icon: '#326DF0' }
            };
            const c = colors[item.type] || { bg: '#F4F8FF', icon: 'var(--primary)' };
            const isLast = idx === forYouItems.length - 1;
            return `
              <div style="display: flex; align-items: center; gap: var(--sp-md); padding: var(--sp-lg); border-bottom: ${isLast ? 'none' : '1px solid var(--divider)'};">
                <div style="width: 40px; height: 40px; border-radius: 12px; background-color: ${c.bg}; color: ${c.icon}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <i data-lucide="${item.icon}" style="width: 20px; height: 20px;"></i>
                </div>
                <div style="flex: 1;">
                  <div style="font-weight: 600; font-size: var(--fs-body); color: var(--text-primary);">${item.title}</div>
                  <div style="font-size: var(--fs-small); color: var(--text-secondary); margin-top: 2px;">${item.desc}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    // 4. Quick Access Grid
    let quickAccessHtml = '';
    (data.services || []).forEach(service => {
      const colors = {
        room: { bg: '#EEF4FF', icon: '#1D43B6' },
        mess: { bg: '#F0F6FF', icon: '#326DF0' },
        laundry: { bg: '#EAF1FF', icon: '#061258' },
        repair: { bg: '#FFF0F1', icon: '#E04B55' },
        events: { bg: '#EDF9F2', icon: '#35A86F' },
        resources: { bg: '#EDFAFA', icon: '#22A6A6' }
      };
      const c = colors[service.id] || { bg: '#F4F8FF', icon: 'var(--primary)' };
      quickAccessHtml += `
        <div class="quick-access-item" onclick="Router.navigate('${service.id}')" style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-card); padding: var(--sp-lg) var(--sp-sm); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; text-align: center;">
          <div class="icon-circle" style="background: ${c.bg}; color: ${c.icon}; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: var(--sp-sm);">
            <i data-lucide="${service.icon}" style="width: 20px; height: 20px;"></i>
          </div>
          <div style="font-size: var(--fs-body); font-weight: 600; color: var(--text-primary);">${service.name}</div>
        </div>
      `;
    });

    // 5. Active Requests (Titled "Active Requests" with correct steps status rendering matching the image)
    let repairHtml = '';
    if (data.activeRepair) {
      const r = data.activeRepair;
      let stepsHtml = (r.steps || []).map((step, i) => {
        let dotStyle = '';
        let iconHtml = '';
        if (step.done) {
          // Completed step: Red circle with white checkmark
          dotStyle = 'background: #E04B55; border-color: #E04B55; color: white;';
          iconHtml = '<i data-lucide="check" style="width: 12px; height: 12px;"></i>';
        } else if (step.current) {
          // Current step: Red outline with red dot inside
          dotStyle = 'background: white; border-color: #E04B55; border-width: 2px;';
          iconHtml = '<div style="width: 8px; height: 8px; border-radius: 50%; background: #E04B55;"></div>';
        } else {
          // Future step: Grey outline
          dotStyle = 'background: white; border-color: var(--border); border-width: 2px;';
        }
        return `
          <div style="display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; z-index: 1;">
            <div style="width: 24px; height: 24px; border-radius: 50%; border-style: solid; border-width: 1px; ${dotStyle} display: flex; align-items: center; justify-content: center;">
              ${iconHtml}
            </div>
            <div style="font-size: var(--fs-caption); color: var(--text-secondary); margin-top: 6px; text-align: center; font-weight: ${step.current ? '600' : '400'};">${step.label}</div>
          </div>
        `;
      }).join('');

      repairHtml = `
        <div class="app-card" style="padding: var(--sp-lg);">
          <div style="display: flex; gap: var(--sp-md); align-items: center; margin-bottom: var(--sp-lg);">
            <div style="width: 40px; height: 40px; border-radius: 12px; background: #FFF0F1; color: #E04B55; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <i data-lucide="snowflake" style="width: 20px; height: 20px;"></i>
            </div>
            <div style="flex: 1;">
              <div style="font-weight: 600; font-size: var(--fs-body); color: var(--text-primary);">${r.issue}</div>
              <div style="font-size: var(--fs-small); color: var(--text-secondary); margin-top: 2px;">${r.room} · ${r.date}</div>
            </div>
          </div>
          <div style="display: flex; align-items: flex-start; position: relative; padding: 0 4px;">
            <div style="position: absolute; top: 12px; left: 40px; right: 40px; height: 2px; background: var(--divider); z-index: 0;"></div>
            ${stepsHtml}
          </div>
        </div>
      `;
    } else {
      repairHtml = `
        <div class="app-card" style="text-align: center; color: var(--text-secondary); font-size: var(--fs-body); padding: var(--sp-xl);">
          No active repair requests.
        </div>
      `;
    }

    // 6. Today's Schedule (Vertical timeline with styled cards based on status)
    let scheduleHtml = '';
    const todaySchedule = data.todaySchedule || [];
    if (todaySchedule.length === 0) {
      scheduleHtml = '<div style="color: var(--text-secondary); font-size: var(--fs-body); text-align: center; padding: var(--sp-lg) 0;">No items scheduled for today.</div>';
    } else {
      scheduleHtml = `
        <div style="position: relative; padding-left: 24px;">
          <!-- Timeline line -->
          <div style="position: absolute; left: 7px; top: 8px; bottom: 8px; width: 2px; background-color: var(--divider);"></div>
          
          ${todaySchedule.map(item => {
            let cardStyle = '';
            let dotStyle = '';
            let labelStyle = '';
            
            if (item.time.includes('NOW')) {
              // Active schedule item: filled blue circle, primary blue border card with soft blue tint
              dotStyle = 'background: var(--primary); border-color: var(--primary);';
              cardStyle = 'border: 1px solid var(--primary-light); background-color: #F0F6FF;';
              labelStyle = 'color: var(--primary); font-weight: 700;';
            } else if (item.status === 'Completed') {
              // Completed schedule item: blue circle outline, soft purple-blue tinted card
              dotStyle = 'background: white; border-color: var(--primary-light); border-width: 2px;';
              cardStyle = 'border: 1px solid var(--divider); background-color: #F8FAFC;';
              labelStyle = 'color: var(--text-primary); font-weight: 600;';
            } else {
              // Upcoming/Scheduled: grey outline
              dotStyle = 'background: white; border-color: var(--border); border-width: 2px;';
              cardStyle = 'border: 1px solid var(--border); background-color: var(--surface);';
              labelStyle = 'color: var(--text-secondary); font-weight: 500;';
            }

            return `
              <div style="position: relative; margin-bottom: var(--sp-lg); display: flex; flex-direction: column; gap: var(--sp-xs);">
                <!-- Timeline Dot -->
                <div style="position: absolute; left: -24px; top: 6px; width: 16px; height: 16px; border-radius: 50%; border-style: solid; border-width: 1px; ${dotStyle} z-index: 1;"></div>
                
                <div style="font-size: var(--fs-small); ${labelStyle}">${item.time}</div>
                
                <div class="app-card" style="padding: var(--sp-md); ${cardStyle} display: flex; align-items: center; gap: var(--sp-md);">
                  <div style="color: var(--text-secondary); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <i data-lucide="${item.icon || 'circle'}" style="width: 18px; height: 18px;"></i>
                  </div>
                  <div>
                    <div style="font-weight: 600; font-size: var(--fs-body); color: var(--text-primary);">${item.title}</div>
                    <div style="font-size: var(--fs-caption); color: var(--text-secondary); margin-top: 2px;">${item.location}</div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    // 7. Today's Menu (Mess A card with header)
    const mealLunch = data.messMenu ? data.messMenu.lunch : null;
    const mealDinner = data.messMenu ? data.messMenu.dinner : null;
    
    let lunchItems = mealLunch ? mealLunch.items.join(', ') : 'Paneer Butter Masala, Roti, Rice, Dal Tadka';
    let dinnerItems = mealDinner ? mealDinner.items.join(', ') : 'Aloo Gobi, Puri, Veg Pulao, Gulab Jamun';

    let menuHtml = `
      <div class="app-card" style="padding: 0; overflow: hidden;">
        <!-- Card Header -->
        <div style="background-color: #F0F6FF; color: var(--primary); padding: var(--sp-md) var(--sp-lg); display: flex; align-items: center; gap: var(--sp-md); border-bottom: 1px solid var(--divider);">
          <i data-lucide="utensils" style="width: 18px; height: 18px;"></i>
          <span style="font-weight: 600; font-size: var(--fs-body);">Mess A</span>
        </div>
        <!-- Card Body -->
        <div style="padding: var(--sp-lg); display: flex; flex-direction: column; gap: var(--sp-lg);">
          <div>
            <div style="font-size: var(--fs-caption); font-weight: 600; color: var(--text-tertiary); text-transform: uppercase;">Lunch (12:30 PM)</div>
            <div style="font-size: var(--fs-body); color: var(--text-primary); font-weight: 500; margin-top: 4px; line-height: 1.4;">${lunchItems}</div>
          </div>
          <div style="border-top: 1px solid var(--divider); padding-top: var(--sp-lg);">
            <div style="font-size: var(--fs-caption); font-weight: 600; color: var(--text-tertiary); text-transform: uppercase;">Dinner (07:30 PM)</div>
            <div style="font-size: var(--fs-body); color: var(--text-primary); font-weight: 500; margin-top: 4px; line-height: 1.4;">${dinnerItems}</div>
          </div>
        </div>
      </div>
    `;

    // Dynamic Greetings text
    const studentName = data.student ? data.student.name : 'Sid';

    content.innerHTML = `
      <div style="padding: var(--sp-xl) var(--page-padding) var(--sp-xxxl); display: flex; flex-direction: column; gap: var(--sp-xxl);">
        
        <!-- Greeting + Weather -->
        <div style="display: flex; flex-direction: column; align-items: flex-start; gap: var(--sp-xs);">
          <div class="greeting-text" style="font-size: 26px; font-weight: 700; color: var(--text-primary);">Good Morning, ${studentName} 👋</div>
          <div class="greeting-date" style="color: var(--text-secondary); font-size: var(--fs-body);">Friday, 14 August 2025</div>
          
          <div class="weather-pill" style="display: inline-flex; align-items: center; gap: var(--sp-xs); padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border); background-color: var(--surface); font-size: var(--fs-small); color: var(--text-primary); margin-top: var(--sp-xs); font-weight: 500;">
            <i data-lucide="sun" style="width: 16px; height: 16px; color: #F2A51A;"></i>
            <span>${weatherTemp}°C · ${weatherCity}</span>
          </div>
        </div>

        <!-- Room Snapshot Card (Deep Navy Background) -->
        <div class="room-snapshot" onclick="Router.navigate('room')" style="background-color: var(--deep-navy); color: white; padding: var(--sp-xl); border-radius: var(--radius-card-lg); cursor: pointer; display: flex; flex-direction: column; gap: var(--sp-lg); margin-top: -8px; box-shadow: 0 4px 16px rgba(6, 18, 88, 0.12);">
          <div>
            <div style="font-weight: 700; font-size: 20px; color: white;">Block ${block} • Room ${room}</div>
            <div style="display: flex; gap: var(--sp-lg); margin-top: var(--sp-sm); opacity: 0.85;">
              <span style="font-size: var(--fs-small); display: flex; align-items: center; gap: 4px;">
                <i data-lucide="layers" style="width: 14px; height: 14px;"></i> ${floor}
              </span>
              <span style="font-size: var(--fs-small); display: flex; align-items: center; gap: 4px;">
                <i data-lucide="users" style="width: 14px; height: 14px;"></i> ${roommates} Roommates
              </span>
            </div>
          </div>
          
          <button class="btn-outlined" style="align-self: flex-start; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25); color: white; padding: 8px 18px; border-radius: 12px; font-size: var(--fs-small); font-weight: 600; width: auto; height: auto; cursor: pointer; display: flex; align-items: center; gap: var(--sp-xs);">
            <span>View Room</span>
            <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
          </button>
        </div>

        <!-- For You Section -->
        <div>
          <div class="section-header">
            <h2 style="font-size: 18px; font-weight: 700; color: var(--text-primary); margin: 0;">For You</h2>
          </div>
          ${forYouHtml}
        </div>

        <!-- Quick Access Grid -->
        <div>
          <div class="section-header">
            <h2 style="font-size: 18px; font-weight: 700; color: var(--text-primary); margin: 0;">Quick Access</h2>
          </div>
          <div class="quick-access-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--sp-md);">
            ${quickAccessHtml}
          </div>
        </div>

        <!-- Active Requests Tracker -->
        <div>
          <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--sp-md);">
            <h2 style="font-size: 18px; font-weight: 700; color: var(--text-primary); margin: 0;">Active Requests</h2>
            <span class="view-all" onclick="Router.navigate('repair')" style="color: var(--primary); font-size: var(--fs-small); font-weight: 600; cursor: pointer;">View All</span>
          </div>
          ${repairHtml}
        </div>

        <!-- Today's Schedule -->
        <div>
          <div class="section-header" style="margin-bottom: var(--sp-lg);">
            <h2 style="font-size: 18px; font-weight: 700; color: var(--text-primary); margin: 0;">Today's Schedule</h2>
          </div>
          <div class="app-card" style="padding: var(--sp-lg) var(--sp-lg) var(--sp-md);">
            ${scheduleHtml}
          </div>
        </div>

        <!-- Today's Menu -->
        <div>
          <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--sp-md);">
            <h2 style="font-size: 18px; font-weight: 700; color: var(--text-primary); margin: 0;">Today's Menu</h2>
            <span class="view-all" onclick="Router.navigate('mess')" style="color: var(--primary); font-size: var(--fs-small); font-weight: 600; cursor: pointer;">Full Menu</span>
          </div>
          ${menuHtml}
        </div>

        <div style="height: 20px;"></div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
};

window.HomePage = HomePage;
