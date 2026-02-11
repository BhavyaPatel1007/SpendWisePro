const db = require('./db');
(async () => {
    try {
        await db.execute("ALTER TABLE users ADD COLUMN phone VARCHAR(15)");
        console.log("Added phone column to users table.");
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("Phone column already exists.");
        } else {
            console.error("Migration failed:", err);
        }
    } finally {
        process.exit();
    }
})();
