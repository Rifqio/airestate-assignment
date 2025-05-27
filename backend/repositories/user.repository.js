const prisma = require("../utils/prisma");

class UserRepository {
    async findByEmail(email) {
        return prisma.user.findFirst({
            where: {
                email: email,
            },
        });
    }

    async create(email, password) {
        return prisma.user.create({
            data: {
                email,
                password,
                name: email.split('@')[0],
            },
        });
    }
}

module.exports = new UserRepository();
