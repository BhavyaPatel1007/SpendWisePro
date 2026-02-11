const db = require('./db');

(async () => {
    try {
        const [rows] = await db.execute("SHOW COLUMNS FROM users LIKE 'google_id'");
        if (rows.length > 0) {
            console.log('COLUMN_EXISTS: google_id');
        } else {
            console.log('COLUMN_MISSING: google_id');
        }
    } catch (err) {
        console.error('Error:', err);
    } process.exit();
})();
