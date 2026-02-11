const db = require('./db');
async function checkUsers() {
    try {
        const [columns] = await db.execute('SHOW COLUMNS FROM users');
        const names = columns.map(c => c.Field);
        console.log('Columns in users table:', names);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
checkUsers();
