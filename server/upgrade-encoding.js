const db = require('./db');

async function upgradeEncoding() {
    try {
        console.log('--- Upgrading Table Encoding ---');
        await db.execute('ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
        console.log('Users table upgraded to utf8mb4.');
        process.exit(0);
    } catch (error) {
        console.error('Encoding upgrade failed:', error);
        process.exit(1);
    }
}

upgradeEncoding();
