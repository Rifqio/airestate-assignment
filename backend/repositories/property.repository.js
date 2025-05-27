const prisma = require("../utils/prisma");

class PropertyRepository {
    async findByUserId(userId) {
        return prisma.property.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findById(id) {
        return prisma.property.findUnique({
            where: {
                id: id,
            },
        });
    }

    async create(propertyData) {
        return prisma.property.create({
            data: propertyData,
        });
    }

    async update(id, propertyData) {
        return prisma.property.update({
            where: {
                id: id,
            },
            data: propertyData,
        });
    }

    async delete(id) {
        return prisma.property.delete({
            where: {
                id: id,
            },
        });
    }

    async findByIdAndUserId(id, userId) {
        return prisma.property.findFirst({
            where: {
                id: id,
                userId: userId,
            },
        });
    }
}

module.exports = new PropertyRepository();
