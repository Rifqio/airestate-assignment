const propertyRepository = require("../../repositories/property.repository");
const s3Service = require("../../services/supabase.service");
const { Logger } = require("../../utils/logger");

class PropertyService {
    async getAllProperties(userId) {
        return propertyRepository.findByUserId(userId);
    }

    async getPropertyById(id, userId) {
        const property = await propertyRepository.findByIdAndUserId(id, userId);
        if (!property) {
            throw new Error("Property not found");
        }
        return property;
    }

    async createProperty(propertyData, userId, imageFile) {
        try {
            let imageUrl = null;

            // Upload image if provided
            if (imageFile) {
                const fileKey = s3Service.generateFileKey(userId, imageFile.originalname);
                const uploadResult = await s3Service.uploadFile(imageFile, fileKey);
                imageUrl = uploadResult.url;
            }

            const property = await propertyRepository.create({
                ...propertyData,
                userId,
                imageUrl,
                latitude: parseFloat(propertyData.latitude),
                longitude: parseFloat(propertyData.longitude),
                price: parseFloat(propertyData.price),
            });

            return property;
        } catch (error) {
            Logger.error(`Error creating property: ${error.message}`);
            throw error;
        }
    }

    async updateProperty(id, propertyData, userId, imageFile) {
        try {
            const existingProperty = await propertyRepository.findByIdAndUserId(id, userId);
            if (!existingProperty) {
                throw new Error("Property not found");
            }

            let imageUrl = existingProperty.imageUrl;

            if (imageFile) {
                // Delete old image if exists
                if (existingProperty.imageUrl) {
                    try {
                        const oldKey = s3Service.extractKeyFromUrl(existingProperty.imageUrl);
                        if (oldKey) {
                            await s3Service.deleteFile(oldKey);
                        }
                    } catch (error) {
                        Logger.warn(`Failed to delete old image: ${error.message}`);
                    }
                }

                // Upload new image
                const fileKey = s3Service.generateFileKey(userId, imageFile.originalname);
                const uploadResult = await s3Service.uploadFile(imageFile, fileKey);
                imageUrl = uploadResult.url;
            }

            const updateData = {
                ...propertyData,
                imageUrl,
            };

            // Parse numeric fields if provided
            if (propertyData.latitude) updateData.latitude = parseFloat(propertyData.latitude);
            if (propertyData.longitude) updateData.longitude = parseFloat(propertyData.longitude);
            if (propertyData.price) updateData.price = parseFloat(propertyData.price);

            const updatedProperty = await propertyRepository.update(id, updateData);
            return updatedProperty;
        } catch (error) {
            Logger.error(`Error updating property: ${error.message}`);
            throw error;
        }
    }

    async deleteProperty(id, userId) {
        try {
            const existingProperty = await propertyRepository.findByIdAndUserId(id, userId);
            if (!existingProperty) {
                throw new Error("Property not found");
            }

            if (existingProperty.imageUrl) {
                try {
                    const imageKey = s3Service.extractKeyFromUrl(existingProperty.imageUrl);
                    if (imageKey) {
                        await s3Service.deleteFile(imageKey);
                    }
                } catch (error) {
                    Logger.warn(`Failed to delete image: ${error.message}`);
                }
            }

            await propertyRepository.delete(id);
            return { message: "Property deleted successfully" };
        } catch (error) {
            Logger.error(`Error deleting property: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new PropertyService();
