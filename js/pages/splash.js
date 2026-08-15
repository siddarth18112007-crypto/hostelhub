const SplashPage = {
  render() {
    const content = document.getElementById('page-content');
    content.innerHTML = `
      <div class="splash-page">
        <div class="splash-content">
          <div class="splash-brand">
            <span class="brand-dark">Hostel</span><span class="brand-hub">Hub</span>
          </div>
          <p class="splash-subtitle">Your hostel, organized.</p>
        </div>
      </div>
    `;
    // Auto-advance to onboarding after 2 seconds
    setTimeout(() => Router.navigate('onboarding'), 2000);
  }
};
