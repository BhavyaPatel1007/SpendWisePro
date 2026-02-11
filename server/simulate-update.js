const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function simulateUpdate() {
    try {
        console.log('--- Simulating Frontend Settings Update ---');
        const userId = 1; // Assuming user with ID 1 exists
        const token = jwt.sign({ userId }, process.env.JWT_SECRET);
        console.log('Generated token for simulation.');

        const dataToSave = {
            initial_balance: 3000,
            currency: '₹'
        };

        console.log('Sending PUT /api/expenses/settings...');
        const response = await axios.put('http://localhost:5000/api/expenses/settings', dataToSave, {
            headers: { 'x-auth-token': token }
        });

        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));

        process.exit(0);
    } catch (error) {
        console.error('Simulation failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error Message:', error.message);
        }
        process.exit(1);
    }
}

simulateUpdate();
