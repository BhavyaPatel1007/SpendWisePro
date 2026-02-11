-- ==========================================
-- SpendWise Pro - Database Initialization
-- ==========================================

CREATE DATABASE IF NOT EXISTS speedwise_pro;
USE speedwise_pro;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    initial_balance DECIMAL(15, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT '₹',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Transactions Table (User Preferred Structure)
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('Expense', 'Income') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    category VARCHAR(50) NOT NULL,
    note VARCHAR(255),
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================
-- SEED DATA (Matching Dashboard Images)
-- ==========================================

/*
-- 1. UPDATE USER SETTINGS
UPDATE users SET initial_balance = 300600.00, currency = '₹' WHERE id = 1;

-- 2. ADD INCOME
INSERT INTO transactions (user_id, type, amount, category, date, note) 
VALUES (1, 'income', 4750.00, 'Salary', '2026-02-01', 'Salary Inflow');

-- 3. ADD EXPENSES
INSERT INTO transactions (user_id, type, amount, category, date, note) 
VALUES (1, 'expense', 1200.00, 'Rent', '2026-02-05', 'Monthly Apartment Rent');

INSERT INTO transactions (user_id, type, amount, category, date, note) 
VALUES (1, 'expense', 230.00, 'Food', '2026-02-07', 'food zone');

INSERT INTO transactions (user_id, type, amount, category, date, note) 
VALUES (1, 'expense', 50.75, 'Shopping', '2026-02-02', 'Miscellaneous Shopping');
*/
