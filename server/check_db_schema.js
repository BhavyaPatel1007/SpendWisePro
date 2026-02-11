const db = require('./db');

(async () => {
    try {
        console.log('Checking users table schema...');
        const [rows] = await db.execute("DESCRIBE users");
        console.log('Users table columns:');
        rows.forEach(row => {
            console.log(`- ${row.Field} (${row.Type})`);
        });

        console.log('\nChecking existing user data (first 5)...');
        const [users] = await db.execute("SELECT id, email, phone FROM users LIMIT 5");
        users.forEach(u => console.log(`User ${u.id}: ${u.email} - Phone: ${u.phone}`));
    } catch (err) {
        console.error('Error checking schema:', err);
    } finally {
        process.exit();
    }
})();
