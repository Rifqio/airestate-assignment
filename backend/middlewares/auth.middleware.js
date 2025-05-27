const jwtUtil = require('../utils/jwt.util');
const { Logger } = require('../utils/logger');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.error('Unauthorized - No token provided', 401);
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwtUtil.verifyToken(token);

        req.user = decoded;

        next();
    } catch (error) {
        Logger.error(`Authentication error: ${error.message}`);
        return res.unauthorized();
    }
};

module.exports = authMiddleware;
