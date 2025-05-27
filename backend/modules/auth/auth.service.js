const bcrypt = require('bcrypt');
const userRepository = require("../../repositories/user.repository");
const jwtUtil = require('../../utils/jwt.util');

class AuthService {
    async register(email, password, passwordConfirmation) {
        if (password !== passwordConfirmation) {
            throw new Error("Passwords do not match");
        }

        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error("User already exists");
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await userRepository.create(email, hashedPassword);
        
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async login(email, password) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        const token = jwtUtil.generateToken({
            id: user.id,
            email: user.email
        });

        const { password: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token
        };
    }
}

module.exports = new AuthService();
