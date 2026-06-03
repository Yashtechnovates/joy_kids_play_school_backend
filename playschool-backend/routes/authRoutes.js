const express = require('express');
const router = express.Router();
const { login, getMe, setupAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', login);
router.get('/setup', setupAdmin);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;