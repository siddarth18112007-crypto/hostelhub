const SplashPage = {
  render() {
    const content = document.getElementById('page-content');
    content.innerHTML = `
      <div class="splash-page">
        <div style="display:flex;flex-direction:column;align-items:center;gap:12px;">
          <div style="width:72px;height:72px;background:var(--primary);border-radius:20px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 32px rgba(29,67,182,0.25);animation:logoPop 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards;">
            <i data-lucide="building-2" style="width:38px;height:38px;color:#fff;"></i>
          </div>
          <div class="splash-brand">
            <span class="brand-dark">Hostel</span><span class="brand-hub">Hub</span>
          </div>
          <p class="splash-subtitle">Your hostel, organized.</p>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Auto-advance to onboarding after 2.2 seconds
    setTimeout(() => Router.navigate('onboarding'), 2200);
  }
};

window.SplashPage = SplashPage;
