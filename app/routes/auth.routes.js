const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');


// Authentication routes
router.post('/register', authController.register); // Sign up or register users
router.post('/login', authController.login); // Login users
router.get('/users', authController.getAllUsers); // Get all users
router.get('/users/:id', authController.getUserById); // Get user by ID
router.put('/users/:id', authController.updateUserById); // Update user by ID
router.delete('/users/:id', authController.deleteUserById); // Delete user by ID


module.exports = router;


