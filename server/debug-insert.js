const db = require('./db');

async function debugInsert() {
    try {
        console.log('--- Debugging Transaction Insert ---');

        // Mock data matching the user's dashboard image
        const userId = 2; // vraj@gmail.com
        const type = 'expense';
        const amount = 230.00;
        const category = 'Food';
        const date = '2026-02-07';
        const note = 'food zone';

        console.log('Attempting insert with:', { userId, type, amount, category, date, note });

        const [result] = await db.execute(
            'INSERT INTO transactions (user_id, type, amount, category, date, note) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, type, amount, category, date, note]
        );

        console.log('Success! Insert ID:', result.insertId);
        process.exit(0);
    } catch (error) {
        console.error('FAILED TO INSERT:');
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        console.error('SQL State:', error.sqlState);
        process.exit(1);
    }
}

debugInsert();
