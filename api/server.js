require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Establish and verify database connection pool on startup
// Points to PCEA_DANDORA_CMS/backend/db.js
require('../backend/db'); 

// Import Route Handlers
const authRoutes = require('../backend/routes/authRoutes');
const smsRoutes = require('../backend/routes/smsRoutes');
const sessionRoutes = require('../backend/routes/sessionRoutes');

app.use(cors());
app.use(express.json());

// Serve frontend assets out of static middleware using root directory pathing
app.use('/frontend', express.static(path.join(process.cwd(), 'frontend')));

// PRIMARY NAVIGATION VIEWS
app.get('/', (req, res) => {
    // Look for frontend from the project root instead of __dirname
    res.sendFile(path.join(process.cwd(), 'frontend/login.html'), (err) => {
        if (err) {
            res.status(500).send("Critical Error: Core login interface could not be compiled.");
        }
    });
});

app.get('/', (req, res) => {
    // Try using __dirname pathing but let's see the actual error object if it fails
    res.sendFile(path.join(__dirname, '../frontend/login.html'), (err) => {
        if (err) {
            // This will print the actual error code, path attempted, and status
            res.status(500).send({
                message: "Path verification failed",
                error: err.message,
                resolvedPath: path.join(__dirname, '../frontend/login.html'),
                cwd: process.cwd()
            });
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

// SYSTEM API ENDPOINTS
app.use('/api/auth', authRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/session', sessionRoutes);

// START EXPRESS SERVER PIPELINE
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Local server running on port ${PORT}`);
    });
}

// Crucial for Vercel serverless environment
module.exports = app;