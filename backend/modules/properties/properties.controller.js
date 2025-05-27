const { Logger } = require("../../utils/logger");
const propertyService = require("./properties.service");

class PropertyController {
    /**
     * Get all properties for the authenticated user
     * 
     * @param {import('express').Request} req - Express request object
     * @param {import('express').Response} res - Express response object
     * @param {Object} req.user - User object from JWT authentication
     * @param {string} req.user.id - User ID from JWT token
     * @returns {Promise<Object>} Response with array of property objects
     */
    async getAllProperties(req, res) {
        try {
            const userId = req.user.id;
            const properties = await propertyService.getAllProperties(userId);
            
            return res.successWithData(properties, "Properties retrieved successfully");
        } catch (error) {
            Logger.error(`Get properties error: ${error.message}`);
            return res.internalServerError(error.message);
        }
    }

    /**
     * Get a specific property by ID for the authenticated user
     * 
     * @param {import('express').Request} req - Express request object
     * @param {import('express').Response} res - Express response object
     * @param {Object} req.user - User object from JWT authentication
     * @param {string} req.user.id - User ID from JWT token
     * @param {Object} req.params - URL parameters
     * @param {string} req.params.id - Property ID to retrieve
     * @returns {Promise<Object>} Response with property object
     */
    async getPropertyById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            
            const property = await propertyService.getPropertyById(id, userId);
            
            return res.successWithData(property, "Property retrieved successfully");
        } catch (error) {
            Logger.error(`Get property error: ${error.message}`);
            return res.notFound(error.message);
        }
    }

    /**
     * Create a new property for the authenticated user
     * 
     * @param {import('express').Request} req - Express request object
     * @param {import('express').Response} res - Express response object
     * @param {Object} req.user - User object from JWT authentication
     * @param {string} req.user.id - User ID from JWT token
     * @param {Object} req.body - Request body with property data
     * @param {string} req.body.title - Property title
     * @param {string} [req.body.description] - Optional property description
     * @param {number|string} req.body.price - Property price (decimal)
     * @param {number|string} req.body.latitude - Property latitude coordinate
     * @param {number|string} req.body.longitude - Property longitude coordinate
     * @param {string} [req.body.address] - Optional property address
     * @param {File} [req.file] - Optional uploaded image file
     * @returns {Promise<Object>} Response with created property object
     */
    async createProperty(req, res) {
        try {
            const propertyData = req.body;
            const userId = req.user.id;
            const imageFile = req.file;
            
            const property = await propertyService.createProperty(propertyData, userId, imageFile);
            
            return res.createdWithData(property, "Property created successfully");
        } catch (error) {
            Logger.error(`Create property error: ${error.message}`);
            return res.badRequest(error.message);
        }
    }

    /**
     * Update an existing property for the authenticated user
     * 
     * @param {import('express').Request} req - Express request object
     * @param {import('express').Response} res - Express response object
     * @param {Object} req.user - User object from JWT authentication
     * @param {string} req.user.id - User ID from JWT token
     * @param {Object} req.params - URL parameters
     * @param {string} req.params.id - Property ID to update
     * @param {Object} req.body - Request body with property data
     * @param {string} [req.body.title] - Property title
     * @param {string} [req.body.description] - Property description
     * @param {number|string} [req.body.price] - Property price (decimal)
     * @param {number|string} [req.body.latitude] - Property latitude coordinate
     * @param {number|string} [req.body.longitude] - Property longitude coordinate
     * @param {string} [req.body.address] - Property address
     * @param {File} [req.file] - Optional new image file to update property image
     * @returns {Promise<Object>} Response with updated property object
     */
    async updateProperty(req, res) {
        try {
            const { id } = req.params;
            const propertyData = req.body;
            const userId = req.user.id;
            const imageFile = req.file;
            
            const property = await propertyService.updateProperty(id, propertyData, userId, imageFile);
            
            return res.successWithData(property, "Property updated successfully");
        } catch (error) {
            Logger.error(`Update property error: ${error.message}`);
            return res.notFound(error.message);
        }
    }

    /**
     * Delete a property for the authenticated user
     * 
     * @param {import('express').Request} req - Express request object
     * @param {import('express').Response} res - Express response object
     * @param {Object} req.user - User object from JWT authentication
     * @param {string} req.user.id - User ID from JWT token
     * @param {Object} req.params - URL parameters
     * @param {string} req.params.id - Property ID to delete
     * @returns {Promise<Object>} Response with success message
     */
    async deleteProperty(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            
            const result = await propertyService.deleteProperty(id, userId);
            
            return res.successWithData(result, "Property deleted successfully");
        } catch (error) {
            Logger.error(`Delete property error: ${error.message}`);
            return res.notFound(error.message);
        }
    }
}

module.exports = new PropertyController();
