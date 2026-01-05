const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpires } = require('../config/env');

exports.signToken = (payload) => {
    return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpires });
};

exports.verifyToken = (token) => {
    return jwt.verify(token, jwtSecret);
};