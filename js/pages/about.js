window.AboutPage = {
    render: function() {
        const container = document.getElementById('page-content');
        
        container.innerHTML = `
            <div class="page-header" style="display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem;">
                <button class="icon-btn back-btn" onclick="history.back()" style="background:transparent; border:none; cursor:pointer; padding:0.5rem; border-radius:50%; display:flex; align-items:center; justify-content:center;">
                    <i data-lucide="arrow-left"></i>
                </button>
                <h1 style="margin:0; font-size:1.5rem;">About</h1>
            </div>
            
            <div class="about-content" style="text-align:center; padding:3rem 1rem;">
                <div class="about-logo" style="margin-bottom:0.5rem;">
                    <h2 style="font-size:2.5rem; font-weight:800; margin:0; letter-spacing:-0.025em;">
                        <span style="color:var(--brand-dark, #1e3a8a);">Hostel</span><span style="color:var(--brand-primary, #3b82f6);">Hub</span>
                    </h2>
                </div>
                <div class="text-muted" style="font-size:1.1rem; margin-bottom:1rem; color:var(--text-muted);">Your hostel, organized.</div>
                <div class="badge" style="display:inline-block; background:var(--bg-body, #f3f4f6); color:var(--text-muted); padding:0.35rem 1rem; border-radius:1rem; font-size:0.875rem; font-weight:600; border:1px solid var(--border-color, #e5e7eb); margin-bottom:2.5rem;">Version 1.0.0</div>
                
                <p style="color:var(--text-primary); line-height:1.6; margin-bottom:3rem; max-width:400px; margin-left:auto; margin-right:auto; font-size:1.05rem;">
                    HostelHub is a hostel life utility manager designed to help students manage their daily hostel activities — from mess menus and laundry slots to repair requests and events.
                </p>
                
                <div class="app-card about-info" style="text-align:left; max-width:400px; margin:0 auto; background:var(--bg-card, #fff); border-radius:var(--radius-lg, 1rem); padding:1.5rem; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
                    <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:1rem; border-bottom:1px solid var(--border-color, #e5e7eb); margin-bottom:1rem;">
                        <span class="text-muted" style="color:var(--text-muted);">Developed by</span>
                        <strong style="color:var(--text-primary); font-weight:600;">HostelHub Team</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span class="text-muted" style="color:var(--text-muted);">Contact</span>
                        <a href="mailto:support@hostelhub.app" style="color:var(--brand-primary, #3b82f6); text-decoration:none; font-weight:500;">support@hostelhub.app</a>
                    </div>
                </div>
            </div>
        `;
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
};
