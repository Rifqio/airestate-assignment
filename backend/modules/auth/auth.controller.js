const { Logger } = require("../../utils/logger");
const authService = require("./auth.service");

class AuthController {
    /**
     * Register a new user
     * 
     * @param {import('express').Request} req - Express request object
     * @param {import('express').Response} res - Express response object
     * @param {Object} req.body - Request body containing user registration data
     * @param {string} req.body.email - User's email address
     * @param {string} req.body.password - User's password
     * @param {string} req.body.passwordConfirmation - Password confirmation
     * @returns {Promise<Object>} Response with registered user data (excluding password)
     */
    async register(req, res) {
        try {
            const { email, password, passwordConfirmation } = req.body;            
            const user = await authService.register(email, password, passwordConfirmation);

            return res.createdWithData(user, "User registered successfully");
        } catch (error) {
            Logger.error(`Registration error: ${error.message} | stack: ${error.stack}`);
            return res.badRequest(error.message);
        }
    }

    /**
     * Login an existing user
     * 
     * @param {import('express').Request} req - Express request object
     * @param {import('express').Response} res - Express response object
     * @param {Object} req.body - Request body containing login credentials
     * @param {string} req.body.email - User's email address
     * @param {string} req.body.password - User's password
     * @returns {Promise<Object>} Response with user data and JWT token
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await authService.login(email, password);
            
            return res.successWithData(user, "User logged in successfully");
        } catch (error) {
            Logger.error(`Login error: ${error.message} | stack: ${error.stack}`);
            return res.unauthorized(error.message);
        }
    }
}

module.exports = new AuthController();
