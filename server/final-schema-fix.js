const db = require('./db');

async function fixTransactionsTable() {
    try {
        console.log('--- Finalizing Transactions Table ---');

        // 1. Drop the broken table
        await db.execute('DROP TABLE IF EXISTS transactions');
        console.log('Old broken table dropped.');

        // 2. Create the correct table
        await db.execute(`
            CREATE TABLE transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                type ENUM('income', 'expense') NOT NULL,
                amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
                category VARCHAR(50) NOT NULL,
                note VARCHAR(255),
                date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Table "transactions" created correctly with user_id and date.');

        console.log('--- Fix Complete ---');
        process.exit(0);
    } catch (error) {
        console.error('Fix failed:', error);
        process.exit(1);
    }
}

fixTransactionsTable();
