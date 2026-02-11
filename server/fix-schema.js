const db = require('./db');

async function fixSchema() {
    try {
        console.log('--- Fixing Schema ---');

        const [columns] = await db.execute('DESCRIBE expenses');
        const columnNames = columns.map(c => c.Field);

        if (!columnNames.includes('date')) {
            console.log('Adding "date" column with default value...');
            // Adding as NULL first to avoid error, then setting a value, then making it NOT NULL
            await db.execute('ALTER TABLE expenses ADD COLUMN date DATE NULL AFTER category');
            await db.execute("UPDATE expenses SET date = '2026-01-01' WHERE date IS NULL");
            await db.execute('ALTER TABLE expenses MODIFY COLUMN date DATE NOT NULL');
            console.log('"date" column added and initialized.');
        } else {
            console.log('"date" column already exists.');
        }

        if (!columnNames.includes('note')) {
            console.log('Adding "note" column...');
            await db.execute('ALTER TABLE expenses ADD COLUMN note TEXT AFTER date');
            console.log('"note" column added.');
        } else {
            console.log('"note" column already exists.');
        }

        console.log('--- Schema Fix Complete ---');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing schema:', error);
        process.exit(1);
    }
}

fixSchema();
