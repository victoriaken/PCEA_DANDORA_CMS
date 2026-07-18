// frontend/js/admin.js

// Dynamic API Base URL configuration
const API_BASE_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
  ? 'http://localhost:5000'  // Replace 5000 if your Node backend is on a different local port
  : 'https://your-backend-service.onrender.com'; // Replace with your production URL later

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initDateTime();
    fetchDashboardMetrics();
    initForms();
});

// Panel Navigation Handlers
function initNavigation() {
    const labels = { ov: 'Overview Dashboard', mb: 'Members', dt: 'Districts', fl: 'Financial Ledger', sm: 'SMS Broadcast', st: 'Settings' };
    const navItems = document.querySelectorAll('.sb-nav .ni');
    const panels = document.querySelectorAll('.panel');
    const pageLabel = document.getElementById('page-label');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            
            navItems.forEach(n => n.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            item.classList.add('active');
            const targetPanel = document.getElementById(`p-${target}`);
            if(targetPanel) targetPanel.classList.add('active');
            if(pageLabel) pageLabel.textContent = labels[target];
        });
    });

    // Handle interactive Quick Actions links
    document.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const dest = btn.getAttribute('data-action').replace('go-', '');
            const targetNav = document.querySelector(`.ni[data-target="${dest}"]`);
            if (targetNav) targetNav.click();
        });
    });
}

function initDateTime() {
    const dateEl = document.getElementById('dashboard-date');
    if (dateEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = new Date().toLocaleDateString('en-US', options);
    }
}

// REST Backend Communications Layer
async function fetchDashboardMetrics() {
    try {
        // Linked dynamic base URL sequence mapped to your Express backend infrastructure
        const response = await fetch(`${API_BASE_URL}/api/dashboard/summary`);
        if (response.ok) {
            const data = await response.json();
            // Map live backend variables here if desired (e.g., data.totalMembers)
        }
        
        // Mocking structure fallback layout before fetch linkage
        document.getElementById('ov-total-members').textContent = '1,284';
        document.getElementById('ov-active-districts').textContent = '4';
        document.getElementById('ov-month-collections').textContent = 'KES 363,800';
        document.getElementById('ov-tithes').textContent = 'KES 198,400';
        document.getElementById('ov-offerings').textContent = 'KES 87,200';
        document.getElementById('ov-sms-sent').textContent = '3,852';
        
        initCharts();
    } catch (err) {
        console.error("Dashboard engine data population failure:", err);
    }
}

function initCharts() {
    const ctxOv = document.getElementById('c-ov');
    if (ctxOv) {
        new Chart(ctxOv, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    data: [280000, 295000, 320000, 310000, 340000, 363800],
                    borderColor: '#639922',
                    backgroundColor: '#eaf3de',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
    }
}

function initForms() {
    const smsForm = document.getElementById('sms-broadcast-form');
    if(smsForm) {
        smsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(smsForm);
            const payload = {
                title: formData.get('title'),
                recipientGroup: formData.get('recipientGroup'),
                message: formData.get('message')
            };

            try {
                const res = await fetch(`${API_BASE_URL}/api/sms/broadcast`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if(res.ok) {
                    alert('Broadcast sent successfully!');
                    smsForm.reset();
                }
            } catch(err) {
                console.error("Transmission breakdown: ", err);
            }
        });
    }
}

// Append logic handling for global navigation dropouts
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            // Instruct backend clear cookie requests
            await fetch(`${API_BASE_URL}/api/auth/logout`, { method: 'POST' });
        } catch (err) {
            console.error("Backend session clear failed, completing client redirect:", err);
        }
        window.location.href = 'index.html?logout=true';
    });
}