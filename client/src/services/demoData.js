    const getDemoDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
};

export const DEMO_TRANSACTIONS = [
    {
        id: 'demo-1',
        amount: 4500,
        category: 'Salary',
        note: 'Monthly Salary Deposit',
        date: getDemoDate(2),
        isDemo: true
    },
    {
        id: 'demo-2',
        amount: -1200,
        category: 'Rent',
        note: 'Apartment Monthly Rent',
        date: getDemoDate(1),
        isDemo: true
    },
    {
        id: 'demo-3',
        amount: -85.50,
        category: 'Food',
        note: 'Dinner with friends at Bistro',
        date: getDemoDate(0),
        isDemo: true
    },
    {
        id: 'demo-4',
        amount: -150.25,
        category: 'Shopping',
        note: 'New headphones from Amazon',
        date: getDemoDate(3),
        isDemo: true
    },
    {
        id: 'demo-5',
        amount: -45.00,
        category: 'Travel',
        note: 'Fuel refill',
        date: getDemoDate(4),
        isDemo: true
    },
    {
        id: 'demo-6',
        amount: 250.00,
        category: 'Investment',
        note: 'Dividend payout',
        date: getDemoDate(5),
        isDemo: true
    }
];
