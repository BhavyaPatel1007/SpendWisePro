const db = require('./db');

async function updateSchema() {
    try {
        console.log('--- Updating Users Schema ---');
        const [columns] = await db.execute('DESCRIBE users');
        const names = columns.map(c => c.Field);

        if (!names.includes('initial_balance')) {
            console.log('Adding "initial_balance" column...');
            await db.execute('ALTER TABLE users ADD COLUMN initial_balance DECIMAL(15, 2) DEFAULT 0.00');
            console.log('"initial_balance" added.');
        }

        if (!names.includes('currency')) {
            console.log('Adding "currency" column...');
            await db.execute("ALTER TABLE users ADD COLUMN currency VARCHAR(10) DEFAULT '$'");
            console.log('"currency" added.');
        }

        console.log('--- Schema Update Complete ---');
        process.exit(0);
    } catch (error) {
        console.error('Error updating schema:', error);
        process.exit(1);
    }
}

updateSchema();
