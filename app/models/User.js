const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    name: String,
    email: String,
    password: String,
    contact: String,
    roles: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roles',
        required: true
    },
    /*role: {
        type: String,
        enum: ['admin', 'resident', 'collector']
    },*/
   
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
