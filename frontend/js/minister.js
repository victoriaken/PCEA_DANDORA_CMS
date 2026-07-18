// frontend/js/minister.js

// Dynamic API Base URL configuration
const API_BASE_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
  ? 'http://localhost:5000'  // Your local Node.js backend port
  : 'https://your-backend-service.onrender.com'; // Replace with your production URL later

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    fetchMinisterialMetrics();
    initFormHandlers();
});

function initNavigation() {
    const labels = { ov: 'Ministerial Overview', pc: 'Pastoral Care Log', sc: 'Sacraments & Rites Register', sm: 'Sermon Archive', st: 'Parish Statistics' };
    const navItems = document.querySelectorAll('.sb-nav .ni');
    const panels = document.querySelectorAll('.panel');
    const pageLabel = document.getElementById('page-label');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            navItems.forEach(n => n.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            item.classList.add('active');
            document.getElementById(`p-${target}`).classList.add('active');
            pageLabel.textContent = labels[target];
        });
    });
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('dashboard-date').textContent = new Date().toLocaleDateString('en-US', options);
}

function fetchMinisterialMetrics() {
    // Structural dynamic UI element bindings
    document.getElementById('ov-avg-attendance').textContent = '847';
    document.getElementById('ov-visitations').textContent = '14';
    document.getElementById('ov-pending-rites').textContent = '17';
    document.getElementById('ov-districts-count').textContent = '26';

    // Inject static view content loop rows
    const summaryTable = document.getElementById('pastoral-summary-tbody');
    summaryTable.innerHTML = `
        <tr><td>Dandora North</td><td>Home Blessing</td><td><span class="bdg bg">Completed</span></td><td>June 24</td></tr>
        <tr><td>Korogocho</td><td>Hospital Visit</td><td><span class="bdg bg">Completed</span></td><td>June 22</td></tr>
        <tr><td>Baba Dogo</td><td>Bereavement Support</td><td><span class="bdg ba">Follow-up</span></td><td>June 19</td></tr>
    `;

    renderMinisterCharts();
}

function renderMinisterCharts() {
    // Attendance vs Income Dual Metric Bar/Line Combo Layout
    new Chart(document.getElementById('c-attendance-trends'), {
        type: 'bar',
        data: {
            labels: ['May 24', 'May 31', 'Jun 07', 'Jun 14', 'Jun 21', 'Jun 28'],
            datasets: [
                { type: 'line', label: 'Attendance', data: [780, 795, 810, 805, 830, 847], borderColor: '#1a2e1e', tension: 0.3, yAxisID: 'y' },
                { type: 'bar', label: 'Giving (KES x1000)', data: [310, 290, 340, 325, 350, 364], backgroundColor: '#639922', yAxisID: 'y1' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { type: 'linear', position: 'left' },
                y1: { type: 'linear', position: 'right', grid: { drawOnChartArea: false } }
            }
        }
    });

    // Pastoral Care Breakdown Horizontal Distribution
    new Chart(document.getElementById('c-pastoral-breakdown'), {
        type: 'bar',
        data: {
            labels: ['Home Visits', 'Hospital', 'Counseling', 'Outreach'],
            datasets: [{
                data: [6, 3, 3, 2],
                backgroundColor: ['#1a2e1e', '#378add', '#7f77dd', '#ba7517']
            }]
        },
        options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}

function initFormHandlers() {
    const form = document.getElementById('pastoral-log-form');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Data maps effortlessly: form.memberTarget.value, form.careType.value, form.notes.value
            const t = document.getElementById('toast');
            t.style.display = 'flex';
            setTimeout(() => t.style.display = 'none', 2500);
            form.reset();
        });
    }
}

// Append logic handling for global navigation dropouts
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            // Updated with dynamic API base URL
            await fetch(`${API_BASE_URL}/api/auth/logout`, { method: 'POST' });
        } catch (err) {
            console.error("Logout fetch failed:", err);
        }
        window.location.href = 'index.html';
    });
}