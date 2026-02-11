const db = require('./db');

async function checkUsersTable() {
    try {
        console.log('--- Users Table Columns ---');
        const [columns] = await db.execute('DESCRIBE users');
        console.table(columns);
        process.exit(0);
    } catch (error) {
        console.error('Error checking users table:', error);
        process.exit(1);
    }
}

checkUsersTable();
