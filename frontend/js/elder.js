// frontend/js/elder.js

// Dynamic API Base URL configuration
const API_BASE_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
  ? 'http://localhost:5000'  // Your local Node.js backend port
  : 'https://your-backend-service.onrender.com'; // Replace with your production URL later

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    loadDistrictMetrics();
    initSearchFilter();
});

function initNavigation() {
    const labels = { do: 'District Overview', mr: 'Member Roster', dc: 'Clearances & Cards', da: 'District Attendance' };
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
}

function loadDistrictMetrics() {
    // Isolated context parameters for an individual Elder's scope
    document.getElementById('do-total-families').textContent = '42';
    document.getElementById('do-active-members').textContent = '168';
    document.getElementById('do-pending-clearances').textContent = '3';
    document.getElementById('do-avg-attendance').textContent = '154';

    // Seed District Member Roster Array data loop
    const rosterTable = document.getElementById('elder-roster-tbody');
    const members = [
        { id: 'MEM-0941', name: 'John Kamau Mwangi', head: 'Self', status: 'Active', last: 'June 28' },
        { id: 'MEM-1102', name: 'Mary Wanjiku Kamau', head: 'John Kamau', status: 'Active', last: 'June 28' },
        { id: 'MEM-1423', name: 'David Gatheru Njogu', head: 'Self', status: 'Under Discipline', last: 'May 17' },
        { id: 'MEM-2051', name: 'Grace Mutheu Nzioki', head: 'Self', status: 'Active', last: 'June 21' }
    ];

    rosterTable.innerHTML = members.map(m => `
        <tr>
            <td><code>${m.id}</code></td>
            <td><strong>${m.name}</strong></td>
            <td>${m.head}</td>
            <td><span class="bdg ${m.status === 'Active' ? 'bg' : 'br'}">${m.status}</span></td>
            <td>${m.last}</td>
        </tr>
    `).join('');

    renderElderCharts();
}

function renderElderCharts() {
    new Chart(document.getElementById('c-district-attendance'), {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
            datasets: [{
                label: 'District Headcount Attending',
                data: [142, 149, 155, 151, 154],
                borderColor: '#1a2e1e',
                backgroundColor: 'rgba(26, 46, 30, 0.05)',
                fill: true,
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}

function initSearchFilter() {
    const searchInput = document.getElementById('roster-search');
    searchInput.addEventListener('keyup', () => {
        const value = searchInput.value.toLowerCase();
        const rows = document.querySelectorAll('#elder-roster-tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(value) ? '' : 'none';
        });
    });
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