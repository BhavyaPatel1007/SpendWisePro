const db = require('./db');
const bcrypt = require('bcrypt');

async function fixPasswords() {
    try {
        const [users] = await db.execute('SELECT id, password FROM users');
        console.log(`Found ${users.length} users.`);

        for (const user of users) {
            // Check if already hashed (bcrypt hashes start with $2b$ or $2a$)
            if (!user.password.startsWith('$2b$') && !user.password.startsWith('$2a$')) {
                console.log(`Hashing password for user ID: ${user.id}`);
                const hashedPassword = await bcrypt.hash(user.password, 10);
                await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
                console.log(`Updated user ID: ${user.id}`);
            } else {
                console.log(`User ID: ${user.id} already has a hashed password.`);
            }
        }

        console.log('Done fixing passwords.');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing passwords:', error);
        process.exit(1);
    }
}

fixPasswords();
