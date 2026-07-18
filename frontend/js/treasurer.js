// frontend/js/treasurer.js

// Dynamic API Base URL configuration
const API_BASE_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
  ? 'http://localhost:5000'  // Your local Node.js backend port
  : 'https://your-backend-service.onrender.com'; // Replace with your production URL later

const labels = {
  'ov': 'Financial overview',
  'co': 'Contributions',
  'ex': 'Expenditure',
  'fs': 'Financial statements',
  'bu': 'Budget tracking',
  'rp': 'Reports'
};

// Panel switching function
function nav(id, el) {
  document.querySelectorAll('.ni').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('p-', id).classList.add('active');
  document.getElementById('page-label').textContent = labels[id];
}

// Quick action toast confirmation
function showToast() {
  const t = document.getElementById('toast');
  t.style.display = 'flex';
  setTimeout(() => t.style.display = 'none', 3000);
}

// Financial Statement dynamic template fragments
const ieStmt = `
<div class="stmt-section"><i class="ti ti-arrow-up-circle" aria-hidden="true"></i> Income</div>
<div class="stmt-row"><span class="fl">Tithes</span><span class="fvg">KES 198,400</span></div>
<div class="stmt-row"><span class="fl">Sunday offerings</span><span class="fvg">KES 87,200</span></div>
<div class="stmt-row"><span class="fl">Special offerings</span><span class="fvg">KES 43,000</span></div>
<div class="stmt-row"><span class="fl">Building fund</span><span class="fvg">KES 35,200</span></div>
<div class="stmt-row"><span class="fl">Grants & donations</span><span class="fvg">KES 15,000</span></div>
<div class="stmt-total"><span>Total income</span><span style="color:#27500a;">KES 378,800</span></div>
<div class="stmt-section"><i class="ti ti-arrow-down-circle" aria-hidden="true"></i> Expenditure</div>
<div class="stmt-row"><span class="fl">Salaries & allowances</span><span class="fvr">KES 62,000</span></div>
<div class="stmt-row"><span class="fl">Outreach & missions</span><span class="fvr">KES 31,000</span></div>
<div class="stmt-row"><span class="fl">Maintenance</span><span class="fvr">KES 24,000</span></div>
<div class="stmt-row"><span class="fl">Utilities</span><span class="fvr">KES 18,000</span></div>
<div class="stmt-row"><span class="fl">Administration</span><span class="fvr">KES 14,000</span></div>
<div class="stmt-row"><span class="fl">Equipment</span><span class="fvr">KES 9,500</span></div>
<div class="stmt-row"><span class="fl">Youth ministry</span><span class="fvr">KES 11,000</span></div>
<div class="stmt-row"><span class="fl">Miscellaneous</span><span class="fvr">KES 6,200</span></div>
<div class="stmt-total"><span>Total expenditure</span><span style="color:#a32d2d;">KES 175,700</span></div>
<div class="stmt-grand"><span>Net surplus</span><span style="color:#27500a;">KES 203,100</span></div>`;

const bsStmt = `
<div class="stmt-section">Assets</div>
<div class="stmt-row"><span class="fl">Cash on hand</span><span class="fv">KES 342,000</span></div>
<div class="stmt-row"><span class="fl">M-Pesa float</span><span class="fv">KES 118,000</span></div>
<div class="stmt-row"><span class="fl">Bank (Equity Bank)</span><span class="fv">KES 224,000</span></div>
<div class="stmt-row"><span class="fl">Equipment & vehicles</span><span class="fv">KES 185,000</span></div>
<div class="stmt-row"><span class="fl">Land & buildings</span><span class="fv">KES 2,400,000</span></div>
<div class="stmt-total"><span>Total assets</span><span>KES 3,269,000</span></div>
<div class="stmt-section">Liabilities</div>
<div class="stmt-row"><span class="fl">Accounts payable</span><span class="fvr">KES 28,000</span></div>
<div class="stmt-row"><span class="fl">Deferred income</span><span class="fvr">KES 15,000</span></div>
<div class="stmt-total"><span>Total liabilities</span><span style="color:#a32d2d;">KES 43,000</span></div>
<div class="stmt-section">Fund equity</div>
<div class="stmt-row"><span class="fl">Accumulated fund</span><span class="fvg">KES 3,113,000</span></div>
<div class="stmt-row"><span class="fl">Surplus for period</span><span class="fvg">KES 113,000</span></div>
<div class="stmt-grand"><span>Total equity</span><span style="color:#27500a;">KES 3,226,000</span></div>`;

const cfStmt = `
<div class="stmt-section">Operating activities</div>
<div class="stmt-row"><span class="fl">Surplus for period</span><span class="fvg">KES 113,000</span></div>
<div class="stmt-row"><span class="fl">Depreciation add-back</span><span class="fvg">KES 22,000</span></div>
<div class="stmt-row"><span class="fl">Changes in payables</span><span class="fvg">KES 8,000</span></div>
<div class="stmt-total"><span>Net from operations</span><span style="color:#27500a;">KES 143,000</span></div>
<div class="stmt-section">Investing activities</div>
<div class="stmt-row"><span class="fl">Equipment purchase</span><span class="fvr">-KES 9,500</span></div>
<div class="stmt-row"><span class="fl">Building fund disbursement</span><span class="fvr">-KES 21,000</span></div>
<div class="stmt-total"><span>Net from investing</span><span style="color:#a32d2d;">-KES 30,500</span></div>
<div class="stmt-section">Financing activities</div>
<div class="stmt-row"><span class="fl">Grant received</span><span class="fvg">KES 30,000</span></div>
<div class="stmt-total"><span>Net from financing</span><span style="color:#27500a;">KES 30,000</span></div>
<div class="stmt-grand"><span>Net cash increase</span><span style="color:#27500a;">KES 142,500</span></div>
<div class="stmt-row"><span class="fl">Opening cash balance</span><span class="fv">KES 541,500</span></div>
<div class="stmt-grand"><span>Closing cash balance</span><span style="color:#27500a;">KES 684,000</span></div>`;

const stmts = { ie: ieStmt, bs: bsStmt, cf: cfStmt };
const stmtTitles = { ie: 'Income & expenditure', bs: 'Balance sheet', cf: 'Cash flow statement' };

function setStmt(k, el) {
  document.querySelectorAll('#p-fs .bdg').forEach(b => { b.className = 'bdg bgr'; b.style.border = ''; });
  el.className = 'bdg bg'; el.style.border = '0.5px solid #c0dd97';
  document.getElementById('stmt-body').innerHTML = stmts[k];
  document.getElementById('stmt-title').textContent = stmtTitles[k];
}

// Safely execute chart drawing once document structure settles
document.addEventListener("DOMContentLoaded", () => {
  // Prime first sub-statement tab template load
  const initialTab = document.getElementById('st-ie');
  if (initialTab) setStmt('ie', initialTab);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const xo = { grid: { display: false }, ticks: { font: { size: 10 }, color: '#7a7567', autoSkip: false } };
  const yo = { grid: { color: '#f0ede4' }, ticks: { font: { size: 10 }, color: '#7a7567' } };

  // Chart 1: Income vs Expenditure
  new Chart(document.getElementById('c-ov1'), {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        { label: 'Income', data: [280000, 295000, 320000, 310000, 340000, 363800], backgroundColor: '#639922', borderRadius: 3, barThickness: 11 },
        { label: 'Expenditure', data: [148000, 162000, 155000, 170000, 168000, 175700], backgroundColor: '#e24b4a', borderRadius: 3, barThickness: 11 }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: xo, y: { ...yo, ticks: { font: { size: 10 }, color: '#7a7567', callback: v => (v / 1000) + 'k' } } } }
  });

  // Chart 2: Surplus Trend
  new Chart(document.getElementById('c-ov2'), {
    type: 'line',
    data: {
      labels: months,
      datasets: [{ data: [132000, 133000, 165000, 140000, 172000, 188100], borderColor: '#639922', backgroundColor: '#eaf3de', fill: true, tension: 0.4, pointRadius: 3, borderWidth: 2, label: 'Surplus' }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: xo, y: { ...yo, ticks: { font: { size: 10 }, color: '#7a7567', callback: v => (v / 1000) + 'k' } } } }
  });

  // Chart 3: Income breakdown Donut
  new Chart(document.getElementById('c-ov3'), {
    type: 'doughnut',
    data: {
      labels: ['Tithes', 'Offerings', 'Special', 'Building'],
      datasets: [{ data: [198400, 87200, 43000, 35200], backgroundColor: ['#639922', '#1d9e75', '#ba7517', '#378add'], borderWidth: 0, hoverOffset: 3 }]
    },
    options: { responsive: true, maintainAspectRatio: false, cutout: '62%', plugins: { legend: { display: false } } }
  });

  // Chart 4: Horizontal Expense Breakdown
  new Chart(document.getElementById('c-ex'), {
    type: 'bar',
    data: {
      labels: ['Salaries', 'Outreach', 'Mainten.', 'Utilities', 'Admin', 'Ministry', 'Equipment', 'Misc'],
      datasets: [{ data: [62000, 31000, 24000, 18000, 14000, 11000, 9500, 6200], backgroundColor: '#1a2e1e', borderRadius: 3, barThickness: 14, label: 'KES' }]
    },
    options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ...yo, ticks: { font: { size: 10 }, color: '#7a7567', callback: v => (v / 1000) + 'k' } }, y: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#555' } } } }
  });

  // Chart 5: Statement Surplus
  new Chart(document.getElementById('c-fs'), {
    type: 'line',
    data: {
      labels: months,
      datasets: [{ data: [132000, 133000, 165000, 140000, 172000, 203100], borderColor: '#639922', backgroundColor: '#eaf3de', fill: true, tension: 0.4, pointRadius: 3, borderWidth: 2, label: 'Surplus' }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: xo, y: { ...yo, ticks: { font: { size: 10 }, color: '#7a7567', callback: v => (v / 1000) + 'k' } } } }
  });

  // Chart 6: Budget Allocation Vs Actual
  new Chart(document.getElementById('c-bu'), {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        { label: 'Actual', data: [148000, 162000, 155000, 170000, 168000, 175700], backgroundColor: '#1a2e1e', borderRadius: 3, barThickness: 12 },
        { label: 'Budget', data: [175000, 175000, 175000, 175000, 175000, 175000], backgroundColor: '#c0dd97', borderRadius: 3, barThickness: 12 }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: xo, y: { ...yo, ticks: { font: { size: 10 }, color: '#7a7567', callback: v => (v / 1000) + 'k' } } } }
  });
});

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