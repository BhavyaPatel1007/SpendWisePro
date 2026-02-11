const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let token = req.header('x-auth-token');

    const authHeader = req.header('Authorization');
    console.log('--- AUTH CHECK ---');
    console.log('x-auth-token:', token);
    console.log('Authorization:', authHeader);

    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    if (!token) {
        console.warn('--- AUTH BLOCKED: No Token Provided ---');
        console.log('Headers received:', JSON.stringify(req.headers, null, 2));
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    if (!process.env.JWT_SECRET) {
        console.error('CRITICAL ERROR: JWT_SECRET is not defined in environment variables!');
        return res.status(500).json({ message: 'Internal Server Error: Auth configuration missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log(`--- AUTH SUCCESS: User ${decoded.userId} ---`);
        next();
    } catch (err) {
        console.error('--- AUTH FAILED: JWT VERIFICATION ---');
        console.error('Error:', err.message);
        console.error('Token Snippet:', token.substring(0, 15) + '...');
        console.error('Secret Defined:', !!process.env.JWT_SECRET);

        res.status(401).json({
            message: 'Token is not valid',
            reason: err.message
        });
    }
};
