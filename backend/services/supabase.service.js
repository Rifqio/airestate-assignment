const supabase = require("../utils/supabase.client");
const { Logger } = require("../utils/logger");

class S3Service {
    constructor() {
        this.bucketName = process.env.S3_BUCKET_NAME || "airestate";
    }

    /**
     * Upload a file to Supabase Storage
     * @param {Express.Multer.File} file The file to upload
     * @param {string} key The object key (path) in the bucket
     * @returns {Promise<{url: string, key: string}>} The URL and key of the uploaded file
     */
    async uploadFile(file, key) {
        try {
            Logger.info(`Uploading file to Supabase Storage: ${key}`);

            const { data, error } = await supabase.storage
                .from(this.bucketName)
                .upload(key, file.buffer, {
                    contentType: file.mimetype,
                    cacheControl: "3600",
                    upsert: false,
                });

            if (error) {
                Logger.error(`Supabase upload error: ${error.message}`);
                throw new Error(`Failed to upload file: ${error.message}`);
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from(this.bucketName).getPublicUrl(key);

            Logger.info(
                `File uploaded successfully to Supabase Storage: ${publicUrl}`
            );

            return {
                url: publicUrl,
                key: data.path,
            };
        } catch (error) {
            Logger.error(
                `Error uploading file to Supabase Storage: ${error.message}`
            );
            throw new Error("Failed to upload file");
        }
    }

    /**
     * Delete a file from Supabase Storage
     * @param {string} key The object key to delete
     */
    async deleteFile(key) {
        try {
            Logger.info(`Deleting file from Supabase Storage: ${key}`);

            const { error } = await supabase.storage
                .from(this.bucketName)
                .remove([key]);

            if (error) {
                Logger.error(`Supabase delete error: ${error.message}`);
                throw new Error(`Failed to delete file: ${error.message}`);
            }

            Logger.info(
                `File deleted successfully from Supabase Storage: ${key}`
            );
        } catch (error) {
            Logger.error(
                `Error deleting file from Supabase Storage: ${error.message}`
            );
            throw new Error("Failed to delete file");
        }
    }

    /**
     * Generate a public URL for a file
     * @param {string} key The object key
     * @returns {string} Public URL
     */
    getPublicUrl(key) {
        try {
            const {
                data: { publicUrl },
            } = supabase.storage.from(this.bucketName).getPublicUrl(key);

            return publicUrl;
        } catch (error) {
            Logger.error(`Error generating public URL: ${error.message}`);
            throw new Error("Failed to generate public URL");
        }
    }

    /**
     * Generate a unique file key for upload
     * @param {string} userId User ID
     * @param {string} originalname Original filename
     * @returns {string} Unique file key
     */
    generateFileKey(userId, originalname) {
        const timestamp = Date.now();
        const extension = originalname.split(".").pop();
        return `properties/${userId}/${timestamp}.${extension}`;
    }

    /**
     * Extract file key from Supabase public URL
     * @param {string} url The public URL
     * @returns {string} The file key/path
     */
    extractKeyFromUrl(url) {
        try {
            const urlParts = url.split(`/object/public/${this.bucketName}/`);
            return urlParts.length > 1 ? urlParts[1] : null;
        } catch (error) {
            Logger.warn(`Could not extract key from URL: ${url}`);
            return null;
        }
    }
}

module.exports = new S3Service();
