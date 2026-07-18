// frontend/js/index.js

// Dynamic API Base URL configuration
const API_BASE_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
  ? 'http://localhost:5000'  // Your local Node.js backend port
  : 'https://your-backend-service.onrender.com'; // Replace with your production URL later

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorBox = document.getElementById('auth-error');
    const errorText = document.getElementById('err-text');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorBox.style.display = 'none';

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // Updated with dynamic API base URL
                const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();

                if (result.success) {
                    // Role-Based UI Architecture Redirection Matrix
                    const targetDashboard = {
                        'ADMIN': 'admin.html',
                        'TREASURER': 'treasurer.html',
                        'MINISTER': 'minister.html',
                        'ELDER': 'elder.html'
                    };

                    const route = targetDashboard[result.user.role];
                    if (route) {
                        window.location.href = route;
                    } else {
                        throw new Error('Unauthorized system assignment.');
                    }
                } else {
                    showError(result.message || 'Authentication rejected.');
                }
            } catch (err) {
                showError('Network connectivity failure or server unreachable.');
            }
        });
    }
    
    function showError(msg) {
        errorText.textContent = msg;
        errorBox.style.display = 'flex';
    }
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