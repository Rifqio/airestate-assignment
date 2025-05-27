const express = require("express");
const router = express.Router();
const multer = require("multer");
const propertyController = require("../modules/properties/properties.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
});

router.use(authMiddleware);

router.get("/v1", propertyController.getAllProperties);
router.get("/v1/:id", propertyController.getPropertyById);
router.post("/v1", upload.single('image'), propertyController.createProperty);
router.put("/v1/:id", upload.single('image'), propertyController.updateProperty);
router.delete("/v1/:id", propertyController.deleteProperty);

module.exports = router;
