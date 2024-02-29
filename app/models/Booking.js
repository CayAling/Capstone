const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    binCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BinCategory'
    },
    collectorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    location: String,
    scheduleDateTime: Date,
    totalPayment: Number,
    quantity:Number,
    
    status: {
        type: String,
        default: 'Booked'
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
