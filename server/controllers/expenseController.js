const db = require('../db');

exports.getExpenses = async (req, res) => {
    try {
        const userId = req.user.userId;
        const [transactions] = await db.execute('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC', [userId]);

        // Map back to app format for frontend compatibility (amount negative if type is Expense)
        const formatted = transactions.map(t => ({
            ...t,
            amount: t.type === 'Expense' ? -Math.abs(t.amount) : Math.abs(t.amount)
        }));

        res.json(formatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching transactions' });
    }
};

exports.addExpense = async (req, res) => {
    try {
        let { amount, category, date, note, type } = req.body;
        const userId = req.user.userId;

        console.log('--- ROOT PROBLEM DIAGNOSIS (Record Request) ---');
        console.log('Incoming Payload:', { amount, category, date, note, type });

        // 1. DATE NORMALIZATION (Fix Cause 1)
        // Check if date is in DD-MM-YYYY format and convert to YYYY-MM-DD
        if (date && date.includes('-')) {
            const parts = date.split('-');
            if (parts[0].length === 2 && parts[2].length === 4) {
                // It's DD-MM-YYYY, convert to YYYY-MM-DD
                date = `${parts[2]}-${parts[1]}-${parts[0]}`;
                console.log('Normalized Date:', date);
            }
        }

        // 2. TYPE NORMALIZATION (Fix Cause 2)
        // Matching Database ENUM Case: 'Expense' or 'Income'
        let finalType = type || (amount < 0 ? 'expense' : 'income');
        finalType = finalType.charAt(0).toUpperCase() + finalType.slice(1).toLowerCase();

        if (!['Income', 'Expense'].includes(finalType)) {
            throw new Error(`Invalid transaction type: ${type}. Must be 'Income' or 'Expense'.`);
        }

        // 3. AMOUNT VALIDATION (Fix Cause 3)
        const finalAmount = Math.abs(parseFloat(amount));
        if (isNaN(finalAmount) || finalAmount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number.' });
        }

        // 4. CATEGORY & NOTE CLEANING (Fix Cause 4)
        const finalCategory = (category || 'Other').substring(0, 50);
        const finalNote = (note || '').substring(0, 255);

        // 5. EXPLICIT SQL QUERY (Fix Cause 5)
        console.log('Final Database Inputs:', { userId, finalType, finalAmount, finalCategory, date, finalNote });

        const [result] = await db.execute(
            'INSERT INTO transactions (user_id, type, amount, category, date, note) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, finalType, finalAmount, finalCategory, date, finalNote]
        );

        console.log('✅ Success! Transaction ID:', result.insertId);

        res.status(201).json({
            id: result.insertId,
            amount: finalType === 'Expense' ? -finalAmount : finalAmount,
            category: finalCategory,
            date,
            note: finalNote,
            type: finalType
        });
    } catch (error) {
        console.error('❌ CRITICAL SAVE ERROR:', error.message);
        console.error('Stack Trace:', error.stack);

        // Final Connection Verification (Cause 6)
        try {
            await db.execute('SELECT 1');
            console.log('🟢 DB Connection is HEALTHY.');
        } catch (dbErr) {
            console.error('🔴 DB CONNECTION FAILED:', dbErr.message);
        }

        res.status(500).json({
            message: 'Failed to save transaction: ' + error.message,
            tip: 'Check date format (YYYY-MM-DD) and amount (> 0)'
        });
    }
};

exports.updateExpense = async (req, res) => {
    try {
        let { amount, category, date, note, type } = req.body;
        const { id } = req.params;
        const userId = req.user.userId;

        console.log('--- UPDATE TRANSACTION ATTEMPT ---');
        console.log('Transaction ID:', id);
        console.log('User ID:', userId);

        // 1. DATE NORMALIZATION
        if (date && date.includes('-')) {
            const parts = date.split('-');
            if (parts[0].length === 2 && parts[2].length === 4) {
                date = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
        }

        // 2. TYPE NORMALIZATION
        // Matching Database ENUM Case: 'Expense' or 'Income'
        let finalType = type || (amount < 0 ? 'expense' : 'income');
        finalType = finalType.charAt(0).toUpperCase() + finalType.slice(1).toLowerCase();

        if (!['Income', 'Expense'].includes(finalType)) {
            throw new Error(`Invalid transaction type: ${type}`);
        }

        // 3. AMOUNT VALIDATION
        const finalAmount = Math.abs(parseFloat(amount));
        if (isNaN(finalAmount) || finalAmount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number.' });
        }

        // 4. CLEANING
        const finalCategory = (category || 'Other').substring(0, 50);
        const finalNote = (note || '').substring(0, 255);

        const [result] = await db.execute(
            'UPDATE transactions SET type = ?, amount = ?, category = ?, date = ?, note = ? WHERE id = ? AND user_id = ?',
            [finalType, finalAmount, finalCategory, date, finalNote, id, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Transaction not found or unauthorized' });
        }

        res.json({ message: 'Transaction updated successfully' });
    } catch (error) {
        console.error('❌ UPDATE ERROR:', error.message);
        res.status(500).json({ message: 'Server error updating transaction: ' + error.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const [result] = await db.execute('DELETE FROM transactions WHERE id = ? AND user_id = ?', [id, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Transaction not found or unauthorized' });
        }

        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting transaction' });
    }
};

exports.getStats = async (req, res) => {
    try {
        const userId = req.user.userId;
        const [user] = await db.execute('SELECT initial_balance FROM users WHERE id = ?', [userId]);
        const initialBalance = parseFloat(user[0]?.initial_balance) || 0;

        const [totals] = await db.execute(`
            SELECT 
                SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END) as income,
                SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END) as expense
            FROM transactions 
            WHERE user_id = ?
        `, [userId]);

        const stats = totals[0] || { income: 0, expense: 0 };
        const income = parseFloat(stats.income) || 0;
        const expense = parseFloat(stats.expense) || 0;

        const [categorySummary] = await db.execute(`
            SELECT category, SUM(amount) as total
            FROM transactions
            WHERE user_id = ? AND type = 'Expense'
            GROUP BY category
        `, [userId]);

        // Get Last Expense
        const [lastExpense] = await db.execute(`
            SELECT amount, date, created_at 
            FROM transactions 
            WHERE user_id = ? AND type = 'Expense' 
            ORDER BY date DESC, created_at DESC 
            LIMIT 1
        `, [userId]);

        res.json({
            totals: {
                income,
                expense,
                balance: initialBalance + income - expense
            },
            categorySummary,
            lastExpense: lastExpense[0] || null
        });
    } catch (error) {
        console.error('GetStats Error:', error);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const { initial_balance, currency } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'User not found in session' });
        }

        const balance = parseFloat(initial_balance) || 0;
        const cur = currency || '$';

        console.log('Updating settings for user:', userId, { balance, cur });

        await db.execute(
            'UPDATE users SET initial_balance = ?, currency = ? WHERE id = ?',
            [balance, cur, userId]
        );

        res.json({ message: 'Settings saved!', initial_balance: balance, currency: cur });
    } catch (error) {
        console.error('UpdateSettings Detailed Error:', error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};
