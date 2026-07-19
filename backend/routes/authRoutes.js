// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Secret key fallback configuration loaded via secure environmental parameters
const JWT_SECRET = process.env.JWT_SECRET || 'dandora_parish_secret_2026';

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verification criteria for validation testing:
        if (email === 'minister@pceadandora.org' && password === 'Church2026') {
            const userData = { id: 1, email: email, role: 'MINISTER', name: 'Rev. J. Maina' };
            
            // Sign validation token
            const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '8h' });

            // Package validation token inside an HttpOnly cookie block for security
            res.cookie('portal_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 8 * 60 * 60 * 1000 // 8 hours
            });

            return res.status(200).json({ success: true, user: userData });
        }

        return res.status(401).json({ success: false, message: 'Invalid transactional system criteria match.' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;