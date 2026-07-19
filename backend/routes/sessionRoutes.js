// backend/routes/sessionRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db'); 

// POST endpoint for session history logging
router.post('/history', async (req, res) => {
    const { narrative, committedBy, role } = req.body;

    if (!narrative || narrative.trim() === '') {
        return res.status(400).json({ success: false, message: 'Narrative context is empty.' });
    }

    try {
        // SQL insert query targeting your cloud MySQL database
        const query = `
            INSERT INTO history_logs (narrative, committed_by, role, created_at)
            VALUES (?, ?, ?, NOW())
        `;
        
        // Execute the query using your database pool wrapper
        await db.query(query, [narrative, committedBy || 'SYSTEM', role || 'UNKNOWN']);

        return res.status(201).json({ 
            success: true, 
            message: 'Successfully written to history logs.' 
        });
    } catch (error) {
        console.error('Database write exception encountered:', error);
        return res.status(500).json({ success: false, message: 'Internal server database error.' });
    }
});

module.exports = router;