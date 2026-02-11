const db = require('./db');

async function inspectUsers() {
    try {
        const [users] = await db.execute('SELECT email, password FROM users');
        console.log('--- User Passwords in DB ---');
        users.forEach(user => {
            console.log(`Email: ${user.email}`);
            console.log(`Password Hash: ${user.password}`);
            console.log(`Is BCrypt Hash: ${user.password.startsWith('$2b$') || user.password.startsWith('$2a$')}`);
            console.log('---');
        });
        process.exit(0);
    } catch (error) {
        console.error('Error inspecting users:', error);
        process.exit(1);
    }
}

inspectUsers();
