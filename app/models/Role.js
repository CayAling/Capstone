const mongoose = require('mongoose');

// Define the role schema
const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['admin', 'resident', 'collector'], // Ensure the role is one of these values
        unique: true // Ensure uniqueness of role names
    }
});

// Export the Role model
module.exports = mongoose.model('Role', roleSchema);
