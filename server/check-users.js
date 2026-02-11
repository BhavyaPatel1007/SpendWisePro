const db = require('./db');
async function checkUsers() {
    try {
        const [columns] = await db.execute('DESCRIBE users');
        console.log(JSON.stringify(columns, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
checkUsers();
