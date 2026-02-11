const db = require('./db');

async function testUpdate() {
    try {
        console.log('--- Testing Update Settings ---');
        // Get first user
        const [users] = await db.execute('SELECT id FROM users LIMIT 1');
        if (users.length === 0) {
            console.log('No users found.');
            process.exit(0);
        }
        const userId = users[0].id;
        console.log('Testing with userId:', userId);

        const initial_balance = 500.50;
        const currency = '₹';

        const [result] = await db.execute(
            'UPDATE users SET initial_balance = ?, currency = ? WHERE id = ?',
            [initial_balance, currency, userId]
        );
        console.log('Update Result:', JSON.stringify(result, null, 2));

        const [updatedUser] = await db.execute('SELECT initial_balance, currency FROM users WHERE id = ?', [userId]);
        console.log('Updated User Data:', JSON.stringify(updatedUser[0], null, 2));

        process.exit(0);
    } catch (error) {
        console.error('Update test failed:', JSON.stringify(error, null, 2));
        process.exit(1);
    }
}

testUpdate();
