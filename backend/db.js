require('dotenv').config(); // 👈 Essential to load the keys from your .env file
const mysql = require('mysql2/promise'); 

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Verify connection pool integrity on application startup
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connected to the cloud PCEA Dandora CMS database successfully!');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection initialization failed:', error.message);
    }
})();

module.exports = pool;