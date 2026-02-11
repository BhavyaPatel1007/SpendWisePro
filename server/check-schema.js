const db = require('./db');

async function checkSchema() {
    try {
        const [columns] = await db.execute('DESCRIBE expenses');
        console.log(JSON.stringify(columns, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error checking schema:', error);
        process.exit(1);
    }
}

checkSchema();
