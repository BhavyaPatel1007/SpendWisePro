const db = require('./db');

(async () => {
    try {
        console.log('Adding google_id column to users table...');
        // Check if column exists first
        const [columns] = await db.execute("SHOW COLUMNS FROM users LIKE 'google_id'");
        if (columns.length === 0) {
            await db.execute("ALTER TABLE users ADD COLUMN google_id VARCHAR(255) DEFAULT NULL UNIQUE");
            console.log('SUCCESS: google_id column added.');
        } else {
            console.log('SKIPPED: google_id column already exists.');
        }
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        process.exit();
    }
})();
