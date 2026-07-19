// backend/controllers/authController.js
const db = require('../db'); // Pointing to your main flattened db.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { role, email, password } = req.body;

    // 1. Basic Backend Validation Guard
    if (!role || !email || !password) {
        return res.status(400).json({ message: "All form fields are strictly required." });
    }

    try {
        // 2. Fetch user and cross-reference their associated role name via an INNER JOIN
        const [users] = await db.execute(
            `SELECT u.*, r.role_name 
             FROM users u 
             INNER JOIN roles r ON u.role_id = r.role_id 
             WHERE u.email = ?`, 
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid email credentials or account does not exist." });
        }

        const user = users[0];

        // 3. Verify Account Status
        if (!user.is_active) {
            return res.status(403).json({ message: "This account has been administrative-locked. Contact Admin." });
        }

        // 4. Validate Role Context Match
        if (user.role_name !== role) {
            return res.status(403).json({ message: `Access denied. Your account is not registered under the '${role}' role.` });
        }

        // 5. Secure Hashed Password Verification via bcrypt
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password credentials. Please try again." });
        }

        // 6. Track Audit Trail: Update last login timestamp asynchronously
        await db.execute('UPDATE users SET last_login = NOW() WHERE user_id = ?', [user.user_id]);

        // 7. Generate a Security Token containing claims for Role-Based Access Control (RBAC)
        const token = jwt.sign(
            { userId: user.user_id, role: user.role_name, name: user.full_name },
            process.env.JWT_SECRET || 'SUPER_SECRET_PARISH_KEY_2026',
            { expiresIn: '8h' }
        );

        // 8. Send Successful Response
        return res.json({
            message: "Authentication successful.",
            token,
            user: {
                name: user.full_name,
                role: user.role_name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Database Login Error:", error);
        return res.status(500).json({ message: "Internal server error occurred during authentication handling." });
    }
};