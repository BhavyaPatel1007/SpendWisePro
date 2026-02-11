const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.put('/profile', verifyToken, authController.updateProfile);
router.post('/reset-password', authController.resetPassword);

// Google Auth Routes
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        // Generate token
        const token = jwt.sign({ userId: req.user.id, userName: req.user.name }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Redirect to frontend with token
        res.redirect(`http://localhost:5173/login/success?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
    }
);

module.exports = router;
