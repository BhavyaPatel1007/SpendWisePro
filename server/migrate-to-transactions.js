const db = require('./db');

async function migrate() {
    try {
        console.log('--- Starting Migration ---');

        // 1. Create the new transactions table if it doesn't exist
        await db.execute(`
            CREATE TABLE IF NOT EXISTS transactions (
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
        console.log('Table "transactions" ensured.');

        // 2. Check if old expenses table exists
        try {
            const [oldData] = await db.execute('SELECT * FROM expenses');
            if (oldData.length > 0) {
                console.log(`Migrating ${oldData.length} records...`);
                for (const row of oldData) {
                    const type = row.amount < 0 ? 'expense' : 'income';
                    const amount = Math.abs(row.amount);
                    await db.execute(
                        'INSERT INTO transactions (user_id, type, amount, category, date, note) VALUES (?, ?, ?, ?, ?, ?)',
                        [row.user_id, type, amount, row.category, row.date, row.note]
                    );
                }
                console.log('Migration successful.');
            }
            // 3. Drop old table
            await db.execute('DROP TABLE expenses');
            console.log('Old table "expenses" dropped.');
        } catch (err) {
            console.log('No old "expenses" table found or already migrated.');
        }

        console.log('--- Migration Complete ---');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
