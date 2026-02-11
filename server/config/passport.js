const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db');
const jwt = require('jsonwebtoken');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, cb) {
        try {
            const email = profile.emails[0].value;
            const googleId = profile.id;
            const name = profile.displayName;
            const avatar = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;

            // Check if user exists
            const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

            let user;
            if (users.length > 0) {
                user = users[0];
                // Update google_id if missing
                if (!user.google_id) {
                    await db.execute('UPDATE users SET google_id = ? WHERE email = ?', [googleId, email]);
                    user.google_id = googleId;
                }
            } else {
                // Create new user
                // Password is required in schema, so we generate a random placeholder or handle it otherwise. 
                // Better to make password nullable or have a specific flag, but for now specific placeholder.
                // Using a dummy password that can't be easily guessed/used.
                const dummyPassword = '$2b$10$UnGu3ss@bl3P@ssw0rd' + Math.random().toString(36).slice(-8);

                const [result] = await db.execute(
                    'INSERT INTO users (name, email, password, initial_balance, currency, phone, google_id) VALUES (?, ?, ?, 0, "$", ?, ?)',
                    [name, email, dummyPassword, null, googleId]
                );
                user = { id: result.insertId, name, email, initial_balance: 0, currency: '$', phone: null, google_id: googleId };
            }

            return cb(null, user);
        } catch (err) {
            return cb(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
        done(null, users[0]);
    } catch (err) {
        done(err, null);
    }
});
