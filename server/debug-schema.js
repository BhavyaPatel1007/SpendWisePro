const db = require('./db');

async function debugSchema() {
    try {
        const [columns] = await db.execute('DESCRIBE expenses');
        const columnNames = columns.map(c => c.Field);
        console.log('Columns found in expenses table:', columnNames);

        if (columnNames.includes('date')) {
            console.log('SUCCESS: "date" column exists.');
        } else {
            console.log('ERROR: "date" column is MISSING.');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error debugging schema:', error);
        process.exit(1);
    }
}

debugSchema();
