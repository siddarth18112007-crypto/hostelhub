const LoginPage = {
  async handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const btn = document.querySelector('.login-page .btn-primary');
      if (btn) btn.textContent = 'Logging in...';
      
      const res = await ApiService.login(email, password);
      const user = ApiService.getCurrentUser();
      
      if (user && user.role === 'ADMIN') {
        Router.navigate('admin');
      } else if (user && user.role === 'STAFF') {
        Router.navigate('staff');
      } else {
        Router.navigate('home');
      }
    } catch (error) {
      alert('Error: ' + error.message);
      const btn = document.querySelector('.login-page .btn-primary');
      if (btn) btn.textContent = 'Login';
    }
  },

  render() {
    const content = document.getElementById('page-content');
    content.innerHTML = `
      <div class="login-page" style="justify-content: center; min-height: 100vh;">
        <div class="login-brand" style="margin-bottom: var(--sp-lg);">
          <span class="brand-dark">Hostel</span><span class="brand-hub">Hub</span>
        </div>
        <h2 class="login-title">Welcome Back</h2>
        <p class="login-subtitle">Sign in to manage your hostel</p>
        
        <div class="input-group" style="margin-bottom: var(--sp-md);">
          <input type="text" class="input-field" id="login-email" placeholder="Student ID / Email" value="sid@hostelhub.app" />
        </div>
        
        <div class="input-group" style="margin-bottom: var(--sp-md);">
          <input type="password" class="input-field" id="login-password" placeholder="Password" value="password123" />
        </div>
        
        <button class="btn-primary" onclick="LoginPage.handleLogin()" style="width: 100%; margin-top: 12px; height: 48px;">Login</button>
        
        <!-- Demo Accounts Box -->
        <div style="background-color: var(--surface-soft); padding: var(--sp-md); border-radius: var(--radius-card); border: 1px solid var(--border); margin-top: 32px; font-size: var(--fs-small);">
          <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 6px; text-transform: uppercase; font-size: var(--fs-caption);">Quick Demo Logins:</div>
          
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 6px;">
              <span>Student: <strong>sid@hostelhub.app</strong></span>
              <button class="btn-outlined" style="padding: 2px 8px; font-size: 11px; height: auto;" onclick="document.getElementById('login-email').value='sid@hostelhub.app'">Fill</button>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 6px;">
              <span>Warden Admin: <strong>warden@hostelhub.app</strong></span>
              <button class="btn-outlined" style="padding: 2px 8px; font-size: 11px; height: auto;" onclick="document.getElementById('login-email').value='warden@hostelhub.app'">Fill</button>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>Staff Mechanic: <strong>staff@hostelhub.app</strong></span>
              <button class="btn-outlined" style="padding: 2px 8px; font-size: 11px; height: auto;" onclick="document.getElementById('login-email').value='staff@hostelhub.app'">Fill</button>
            </div>
          </div>
          <div style="color: var(--text-tertiary); font-size: 10px; margin-top: 8px; text-align: center;">All passwords are "password123"</div>
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
};

window.LoginPage = LoginPage;

