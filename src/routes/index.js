const express = require('express');
const router = express.Router();

const profileRoutes = require('./profileRoutes');
const healthRoutes = require('./healthRoutes');

router.use('/api/github', profileRoutes);
router.use('/health', healthRoutes);

module.exports = router;
