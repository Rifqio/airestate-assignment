const express = require("express");
const router = express.Router();
const AuthRoutes = require('./auth.routes');
const PropertyRoutes = require('./properties.routes');

router.use('/api/auth', AuthRoutes);
router.use('/api/properties', PropertyRoutes);

module.exports = router;
