window.HelpPage = {
    render: function() {
        const container = document.getElementById('page-content');
        
        const faqs = [
            { q: 'How do I book a laundry slot?', a: 'Go to Laundry > Book New Slot and select your preferred time.' },
            { q: 'How do I report a repair issue?', a: 'Go to Repair > New Request and describe the issue.' },
            { q: 'How do I check the mess menu?', a: 'Visit the Mess section from Quick Access or the home page.' },
            { q: 'Who do I contact for hostel issues?', a: 'Use Report a Problem or contact your floor warden.' }
        ];
        
        const faqsHtml = faqs.map(faq => `
            <div class="faq-item">
                <div class="faq-question" onclick="HelpPage.toggleFaq(this)">
                    <span>${faq.q}</span>
                    <i data-lucide="chevron-down" class="faq-icon" style="transition: var(--transition-fast); color: var(--text-tertiary);"></i>
                </div>
                <div class="faq-answer">
                    ${faq.a}
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <div style="padding: var(--sp-xl) var(--page-padding) var(--sp-xxxl);">
                <div class="page-header" style="padding-left: 0; padding-top: 0; margin-bottom: var(--sp-lg); display: flex; align-items: center; gap: var(--sp-md);">
                    <button class="icon-btn back-btn" onclick="history.back()">
                        <i data-lucide="arrow-left"></i>
                    </button>
                    <h1 style="font-size: var(--fs-page-title); font-weight: var(--fw-bold); margin: 0;">Help & Support</h1>
                </div>
                
                <h3 style="margin-top: 0; margin-bottom: var(--sp-sm); font-size: var(--fs-card-heading); color: var(--text-secondary); font-weight: 600;">Frequently Asked Questions</h3>
                <div class="app-card" style="padding: 0; overflow: hidden; margin-bottom: var(--sp-xl);">
                    ${faqsHtml}
                </div>
                
                <h3 style="margin-top: 0; margin-bottom: var(--sp-sm); font-size: var(--fs-card-heading); color: var(--text-secondary); font-weight: 600;">Contact Support</h3>
                <div class="app-card" style="display: flex; flex-direction: column; gap: var(--sp-md);">
                    <div style="display: flex; align-items: center; gap: var(--sp-md);">
                        <div style="background: var(--room-bg); color: var(--room-icon); width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <i data-lucide="phone" style="width: 20px; height: 20px;"></i>
                        </div>
                        <div>
                            <h4 style="margin: 0; font-weight: 600; font-size: var(--fs-body); color: var(--text-primary);">Hostel Office</h4>
                            <div style="color: var(--text-secondary); font-size: var(--fs-small); margin-top: 2px;">Block B, Ground Floor</div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: var(--sp-sm); color: var(--text-secondary); font-size: var(--fs-small); margin-left: 4px;">
                        <i data-lucide="clock" style="width: 16px; height: 16px; color: var(--text-tertiary);"></i> 
                        <span>Mon–Sat, 9 AM – 5 PM</span>
                    </div>
                </div>
                <div style="height: 40px;"></div>
            </div>
        `;
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
    },
    
    toggleFaq: function(el) {
        const item = el.closest('.faq-item');
        const icon = el.querySelector('.faq-icon');
        const isOpen = item.classList.toggle('open');
        
        if (isOpen) {
            icon.style.transform = 'rotate(180deg)';
        } else {
            icon.style.transform = 'rotate(0deg)';
        }
    }
};
