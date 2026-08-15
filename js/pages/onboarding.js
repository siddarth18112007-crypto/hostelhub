const OnboardingPage = {
  currentStep: 0,
  steps: [
    {
      icon: 'layout-dashboard',
      title: 'Everything in One Place',
      desc: 'Access room details, mess menu, laundry, repairs, events and resources — all from one app.'
    },
    {
      icon: 'bell-ring',
      title: 'Stay Updated',
      desc: 'Get real-time alerts about schedule changes, menu updates, and important notices.'
    },
    {
      icon: 'sparkles',
      title: 'Know What\'s Next',
      desc: 'Smart notifications keep you ahead — from laundry slots to upcoming events.'
    }
  ],

  render() {
    const content = document.getElementById('page-content');
    const step = this.steps[this.currentStep];
    
    let dotsHtml = '';
    for (let i = 0; i < this.steps.length; i++) {
      dotsHtml += `<div class="dot ${i === this.currentStep ? 'active' : ''}"></div>`;
    }

    let buttonsHtml = '';
    if (this.currentStep === this.steps.length - 1) {
      buttonsHtml = `
        <button class="btn-primary" onclick="Router.navigate('login')">Get Started</button>
      `;
    } else {
      buttonsHtml = `
        <button class="btn-secondary" onclick="OnboardingPage.skip()">Skip</button>
        <button class="btn-primary" onclick="OnboardingPage.next()">Next</button>
      `;
    }

    content.innerHTML = `
      <div class="onboarding-page">
        <div class="onboarding-illustration">
          <i data-lucide="${step.icon}" style="width: 120px; height: 120px; color: var(--primary);"></i>
        </div>
        <h2 class="onboarding-title">${step.title}</h2>
        <p class="onboarding-desc">${step.desc}</p>
        <div class="onboarding-dots">
          ${dotsHtml}
        </div>
        <div class="onboarding-actions">
          ${buttonsHtml}
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  },

  next() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.render();
    }
  },

  skip() {
    Router.navigate('login');
  }
};
