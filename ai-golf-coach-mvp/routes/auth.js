const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register: POST /api/auth/register
router.post('/register', authController.register);

// Login: POST /api/auth/login
router.post('/login', authController.login);

router.post('/forgot',  authController.forgotPassword);   // no auth
router.post('/reset/:token', authController.resetPassword);

// Get all users: GET /api/auth/users
router.get('/users', authController.getAllUsers);

module.exports = router;
