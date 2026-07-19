require('dotenv').config(); // 🌟 Line 1: Database variables load first!
const express = require('express');
const cors = require('cors'); 
const path = require('path');

const app = express(); 

// Establish and verify database connection pool on startup
require('./db');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const smsRoutes = require('./routes/smsRoutes'); 
const sessionRoutes = require('./routes/sessionRoutes'); 

// ==========================================
// MIDDLEWARE CONFIGURATION
// ==========================================
app.use(cors()); // Safe cross-origin resource sharing for frontend requests
app.use(express.json()); // Essential body parsing for incoming JSON payloads

// Serve frontend assets cleanly out of static middleware
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));

// ==========================================
// PRIMARY NAVIGATION VIEWS
// ==========================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'), (err) => {
        if (err) {
            res.status(500).send("Critical Error: Core login interface could not be compiled.");
        }
    });
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dashboard.html'), (err) => {
        if (err) {
            res.status(500).send("Critical Error: Dashboard interface asset trace missing.");
        }
    });
});

// ==========================================
// SYSTEM API ENDPOINTS
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/sms', smsRoutes); 
app.use('/api/session', sessionRoutes); 

// ==========================================
// FAULT & LIFECYCLE MANAGEMENT
// ==========================================
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Requested operational endpoint not found." });
});

app.use((err, req, res, next) => {
    console.error("Unhandled runtime exception caught in server context:", err.stack);
    res.status(500).json({ success: false, message: "Internal application engine exception encountered." });
});

// ==========================================
// START EXPRESS SERVER PIPELINE
// ==========================================
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 PCEA Dandora CMS Backend running efficiently on port ${PORT}`);
    });
}
module.exports = app;