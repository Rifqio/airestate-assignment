const jwt = require('jsonwebtoken');
const { Logger } = require('./logger');

class JwtUtil {
    constructor() {
        this.secretKey = process.env.JWT_SECRET || 'your_jwt_secret_key';
        this.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    }

    generateToken(payload) {
        try {
            return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn });
        } catch (error) {
            Logger.error(`Error generating JWT: ${error.message}`);
            throw new Error('Error generating authentication token');
        }
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, this.secretKey);
        } catch (error) {
            Logger.error(`Error verifying JWT: ${error.message}`);
            throw new Error('Invalid token');
        }
    }
}

module.exports = new JwtUtil();
