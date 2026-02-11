const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, initial_balance, currency) VALUES (?, ?, ?, 0, "$")',
            [name, email, hashedPassword]
        );

        const token = jwt.sign({ userId: result.insertId }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: { id: result.insertId, name, email, initial_balance: 0, currency: '$' }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during signup' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const [users] = await db.execute('SELECT id, name, email, password, initial_balance, currency, phone FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, userName: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                initial_balance: parseFloat(user.initial_balance) || 0,
                currency: user.currency || '$',
                phone: user.phone || ''
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        console.log('[UpdateProfile] Request body:', req.body);
        const { name, initial_balance, currency, phone } = req.body;
        const userId = req.user?.userId;
        console.log(`[UpdateProfile] UserId: ${userId}`);

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Validate inputs
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const balance = parseFloat(initial_balance) || 0;
        if (balance < 0) {
            return res.status(400).json({ message: 'Initial balance cannot be negative' });
        }

        const validCurrencies = ['₹', '$', '€', '£', '¥'];
        const finalCurrency = validCurrencies.includes(currency) ? currency : '$';

        // Update user profile
        console.log('[UpdateProfile] Executing DB update...');
        const [result] = await db.execute(
            'UPDATE users SET name = ?, initial_balance = ?, currency = ?, phone = ? WHERE id = ?',
            [name.trim(), balance, finalCurrency, phone || null, userId]
        );
        console.log('[UpdateProfile] DB Update Result:', result);

        // Fetch updated user data
        const [users] = await db.execute(
            'SELECT id, name, email, initial_balance, currency, phone, created_at FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUser = users[0];
        console.log('[UpdateProfile] Updated User from DB:', updatedUser);

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                initial_balance: parseFloat(updatedUser.initial_balance) || 0,
                currency: updatedUser.currency || '$',
                phone: updatedUser.phone || '',
                created_at: updatedUser.created_at
            }
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
};


exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        console.log(`[ResetPassword] Request received for email: ${email}`);

        if (!email || !newPassword) {
            console.log('[ResetPassword] Missing email or newPassword');
            return res.status(400).json({ message: 'Email and new password are required' });
        }

        // Check if user exists
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        console.log(`[ResetPassword] Found users: ${users.length}`);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        const [result] = await db.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
        console.log(`[ResetPassword] Update result: affectedRows=${result.affectedRows}`);

        if (result.affectedRows === 0) {
            console.error('[ResetPassword] No rows updated despite user existing');
            return res.status(500).json({ message: 'Failed to update password' });
        }

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'Server error resetting password' });
    }
};
