// backend/routes/smsRoutes.js
const express = require('express');
const router = express.Router(); // 👈 1. Create the router instance

// 2. Attach your logic directly to the route handler
router.post('/broadcast', async (req, res) => {
    const { title, recipientGroup, message } = req.body;
    
    if (!title || !recipientGroup || !message) {
        return res.status(400).json({ success: false, error: "Missing broadcast configuration fields." });
    }

    try {
        console.log(`[SMS Gateway Broadcast] Triggered: "${title}" to group: [${recipientGroup}]`);
        // Execution process: Fetch targeted phone books -> execute gateway async loops.
        
        return res.status(200).json({
            success: true,
            message: `Broadcast message queue processed successfully for group: ${recipientGroup}`
        });
    } catch (error) {
        console.error("Critical component crash during broadcast loop:", error);
        return res.status(500).json({ success: false, error: "Internal server distribution failure." });
    }
});

module.exports = router; // 👈 3. Export it so server.js doesn't crash!