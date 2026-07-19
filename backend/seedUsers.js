const db = require('./db');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
    console.log('🏁 Starting PCEA Dandora CMS database seeding operation...');
    
    try {
        // 1. Seed Roles Table
        console.log('🔹 Seeding system roles...');
        await db.execute(`
            INSERT IGNORE INTO roles (role_id, role_name, description) VALUES
            (1, 'admin', 'Core System Metrics, Staff Provisioning, Security Audits, System Databases'),
            (2, 'treasurer', 'M-Pesa Tithing integration, Financial Records, Export Statements'),
            (3, 'minister', 'Parish Registry management, Growth Metrics, District Schedules'),
            (4, 'elder', 'My District Hub monitoring, Africa\\'s Talking SMS Broadcast, Member Validation Lists')
        `);

        // 2. Seed Contribution Types Table
        console.log('🔹 Seeding church contribution configurations...');
        await db.execute(`
            INSERT IGNORE INTO contribution_types (type_id, type_name, description) VALUES
            (1, 'Tithe', 'Regular monthly/weekly individual tithe'),
            (2, 'Thanksgiving', 'Special thanksgiving offerings'),
            (3, 'Building Fund', 'Contributions designated for infrastructural growth'),
            (4, 'Uniforms', 'Church groups or guild uniform payments')
        `);

        // 3. Generate Hashed Passwords for Test Accounts
        console.log('🔑 Generating secure password hashes via bcrypt...');
        const securePassword = await bcrypt.hash('Parish2026!', 10);

        // 4. Seed User Accounts (One for each core dashboard role context)
        console.log('🔹 Provisioning default system staff profiles...');
        
        const usersToSeed = [
            ['System Admin', 'admin@pceadandora.org', securePassword, 1],
            ['Parish Treasurer', 'treasurer@pceadandora.org', securePassword, 2],
            ['Parish Minister', 'minister@pceadandora.org', securePassword, 3],
            ['District Elder', 'elder@pceadandora.org', securePassword, 4]
        ];

        for (const user of usersToSeed) {
            await db.execute(`
                INSERT IGNORE INTO users (full_name, email, password_hash, role_id, is_active)
                VALUES (?, ?, ?, ?, TRUE)
            `, user);
        }

        console.log('✅ Seeding completed cleanly. All relational data frames initialized.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Critical Error executing database seed arrays:', error);
        process.exit(1);
    }
}

seedDatabase();