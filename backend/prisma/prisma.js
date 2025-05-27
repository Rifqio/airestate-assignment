const { PrismaClient } = require("@prisma/client");
const { Logger } = require("../utils/logger");

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty',
});

module.exports = prisma;