const jwt = require('jsonwebtoken');
const db = require('../util/database');
const dotenv = require('dotenv');

dotenv.config();
const SECRET = process.env.SECRET;

const authenticate = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Authorization header is missing.');
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        const error = new Error('Token not found.');
        error.statusCode = 400;
        throw error;
    }

    let decodedToken = jwt.decode(token);
    if (!decodedToken) {
        const error = new Error('Token is not JWT.');
        error.statusCode = 400;
        throw error;
    }

    let verifiedToken;
    try {
        verifiedToken = jwt.verify(token, SECRET);
    } catch (err) {
        throw err;
    }
    if (!verifiedToken) {
        const error = new Error('Invalid token.');
        error.statusCode = 400;
        throw error;
    }
    req.token = verifiedToken;
    next();
}

const authorize = (roles) => {
    return (req, res, next) => {
        for (let i = 0; i <= roles.length; i++) {
            if (req.token.role === roles[i]) {
                return next();
            }
        }
        res.status(403).json({ message: 'Unauthorized user.' });
    }
}

exports.authenticate = authenticate;
exports.authorize = authorize;