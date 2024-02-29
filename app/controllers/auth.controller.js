const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');


// User registration
exports.register = async (req, res) => {
    try {
        const { name, email, password, roles, contact } = req.body;

        // Check if any required field is missing
        if (!name || !email || !password || !roles) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

         // Check if the role is valid
         const validRoles = ['admin', 'resident', 'collector'];
         if (!validRoles.includes(roles)) {
             return res.status(400).json({ message: 'Invalid role' });
         }

        // Check if the role is admin
        if (roles === 'admin') {
            // Check if an admin user already exists
            const adminUser = await User.findOne({ roles: 'admin' });
            if (adminUser) {
                return res.status(403).json({ message: 'Admin already registered. Cannot register another admin.' });
            }
        }

        let newUser;
        if (roles === 'collector' || roles === 'resident') {
            // Check if contact is provided for collector or resident
            if (!contact) {
                return res.status(400).json({ message: 'Contact is required for collector or resident' });
            }
            // Create a new user with contact
            newUser = new User({ name, email, password, roles, contact });
        } else {
            // Create a new user without contact for other roles
            newUser = new User({ name, email, password, roles });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        newUser.password = hashedPassword;

        // Save the user
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error while handling database error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

// User login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, roles: user.roles }, config.secret, { expiresIn: '24h' });

        // Return user data and token
        res.status(200).json({
            _id: user._id,
            email: user.email,
            role: user.roles,
            accessToken: token
        });
    } catch (err) {
        console.error('Error while handling database error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

// Fetch all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error while handling database error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

// Fetch user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = {
            name: user.name,
            email: user.email,
            role: user.roles,
            contact: user.contact
        };
        res.status(200).json(userData);
    } catch (err) {
        console.error('Error while handling database error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

// Update user by ID
exports.updateUserById = async (req, res) => {
    try {
        const { name, email, password, roles, contact } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user data
        user.name = name;
        user.email = email;
        user.roles = roles;
        user.contact = contact;

        // Update password if provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();

        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.error('Error while handling database error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

// Delete user by ID
exports.deleteUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.remove();
        res.status(200).json({ message: 'User deleted successfully' });
    }catch (err) {
        console.error('Error while handling database error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};
