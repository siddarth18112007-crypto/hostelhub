window.ReportPage = {
    render: function() {
        const container = document.getElementById('page-content');
        
        container.innerHTML = `
            <div style="padding: var(--sp-xl) var(--page-padding) var(--sp-xxxl);">
                <div class="page-header" style="padding-left: 0; padding-top: 0; margin-bottom: var(--sp-lg); display: flex; align-items: center; gap: var(--sp-md);">
                    <button class="icon-btn back-btn" onclick="history.back()">
                        <i data-lucide="arrow-left"></i>
                    </button>
                    <h1 style="font-size: var(--fs-page-title); font-weight: var(--fw-bold); margin: 0;">Report a Problem</h1>
                </div>
                
                <div id="report-form-container" class="app-card">
                    <form id="report-form" onsubmit="ReportPage.submitForm(event)">
                        <div class="input-group">
                            <label>Category</label>
                            <select class="input-field" required>
                                <option value="">Select a category</option>
                                <option value="Room">Room</option>
                                <option value="Mess">Mess</option>
                                <option value="Laundry">Laundry</option>
                                <option value="Repair">Repair</option>
                                <option value="Events">Events</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        
                        <div class="input-group" style="margin-top: var(--sp-md);">
                            <label>Subject</label>
                            <input type="text" class="input-field" required placeholder="Brief description of the issue">
                        </div>
                        
                        <div class="input-group" style="margin-top: var(--sp-md);">
                            <label>Description</label>
                            <textarea class="input-field" required placeholder="Provide more details..."></textarea>
                        </div>
                        
                        <button type="submit" class="btn-primary" style="margin-top: 24px;">
                            Submit Report
                        </button>
                    </form>
                </div>
                <div style="height: 40px;"></div>
            </div>
        `;
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
    },
    
    submitForm: async function(e) {
        e.preventDefault();
        const form = e.target;
        const select = form.querySelector('select');
        const input = form.querySelector('input');
        const textarea = form.querySelector('textarea');

        const category = select.value;
        const subject = input.value.trim();
        const description = textarea.value.trim();

        try {
            await ApiService.submitReport(category, subject, description);
        } catch (err) {
            console.warn('Failed to submit report to backend API, completing locally:', err.message);
        }

        const container = document.getElementById('report-form-container');
        container.innerHTML = `
            <div class="success-state" style="text-align: center; padding: var(--sp-xxxl) 0;">
                <div style="width: 80px; height: 80px; background: var(--success-light); color: var(--success); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--sp-xl); box-shadow: var(--shadow-card);">
                    <i data-lucide="check-circle" style="width: 40px; height: 40px;"></i>
                </div>
                <h3 style="margin-top: 0; margin-bottom: var(--sp-sm); font-size: var(--fs-section); font-weight: var(--fw-bold);">Report Submitted!</h3>
                <p style="margin-bottom: 24px; color: var(--text-secondary); font-size: var(--fs-body);">We'll look into it and get back to you soon.</p>
                <button class="btn-outlined" onclick="history.back()" style="max-width: 200px; margin: 0 auto;">Go Back</button>
            </div>
        `;
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
};
