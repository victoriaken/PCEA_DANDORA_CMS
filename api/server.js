require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ==========================================
// TEMPORARY MOCK DATABASE BYPASS
// ==========================================
// Disabled live DB connection to prevent DNS/connection errors
// require('../backend/db'); 

// Import Route Handlers (Disabled during mock mode)
// const authRoutes = require('../backend/routes/authRoutes');
// const smsRoutes = require('../backend/routes/smsRoutes');
// const sessionRoutes = require('../backend/routes/sessionRoutes');

app.use(cors());
app.use(express.json());

// Serve frontend assets out of static middleware
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));

// ==========================================
// MOCK SYSTEM API ENDPOINTS
// ==========================================

// Mock Auth Routes
app.post('/api/auth/index', (req, res) => {
    return res.status(200).json({
        success: true,
        token: 'mock-jwt-token-12345',
        user: { name: 'Admin User', role: 'Session Clerk' }
    });
});

// Mock Session & Reports Routes
app.use('/api/session', (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Mock data active",
        data: []
    });
});

app.use('/api/sms', (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Mock SMS endpoint ready"
    });
});

// ==========================================
// PRIMARY NAVIGATION VIEWS
// ==========================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'), (err) => {
        if (err) {
            res.status(500).send({
                message: "Critical Error: Core login interface trace missing.",
                error: err.message,
                evaluatedPath: path.join(__dirname, '../frontend/index.html')
            });
        }
    });
});

// Example: Directing to specific dashboard based on role query ?role=admin
app.get('/dashboard', (req, res) => {
    const role = req.query.role; // e.g., /dashboard?role=admin
    
    const rolePages = {
        admin: 'admin.html',
        elder: 'elder.html',
        minister: 'minister.html',
        sessionclerk: 'sessionclerk.html',
        treasurer: 'treasurer.html'
    };

    const targetFile = rolePages[role] || 'index.html';
    res.sendFile(path.join(__dirname, '../frontend', targetFile));
});

// ==========================================
// START EXPRESS SERVER PIPELINE
// ==========================================
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Mock server active and listening on port ${PORT}`);
    });
}

// Crucial for Vercel serverless environment
module.exports = app;