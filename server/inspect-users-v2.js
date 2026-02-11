const db = require('./db');

async function checkUsersTable() {
    try {
        const [columns] = await db.execute('DESCRIBE users');
        console.log(JSON.stringify(columns, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error checking users table:', JSON.stringify(error, null, 2));
        process.exit(1);
    }
}

checkUsersTable();
