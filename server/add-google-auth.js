const db = require('./db');

(async () => {
    try {
        console.log('Starting migration for Google Auth...');

        // 1. Add google_id column
        try {
            await db.execute("ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE DEFAULT NULL");
            console.log("✅ Added google_id column.");
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log("ℹ️ google_id column already exists.");
            } else {
                throw err;
            }
        }

        // 2. Make password nullable
        try {
            await db.execute("ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NULL");
            console.log("✅ Modified password column to be nullable.");
        } catch (err) {
            console.error("❌ Failed to modify password column:", err);
        }

        console.log('Migration completed.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        process.exit();
    }
})();
