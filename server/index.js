const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    // origin: process.env.CLIENT_URL || "http://localhost:5173",
    // credentials: true,
    // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    // allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"]
}));
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('SpendWise Pro API is running...');
});

// Auth Routes
const passport = require('passport');
require('./config/passport');
app.use(passport.initialize());

app.use('/auth', require('./routes/auth')); // Changed from /api/auth for Google convenience
app.use('/api/auth', require('./routes/auth')); // Keep existing for local auth

// Expense Routes
app.use('/api/expenses', require('./routes/expenses'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
