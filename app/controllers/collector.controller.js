const Booking = require('../models/Booking');
const Invoice = require('../models/Invoice');
const User = require('../models/User');

exports.viewAssignedSchedules = async (req, res) => {
    try {
        const userId = req.userId; 

        // Find bookings assigned to the collector
        const bookings = await Booking.find({ collectorId: userId })
            .populate({
                path: 'userId',
                select: 'name contact' // Populate the resident's name and contact
            })
            .populate({
                path: 'binCategoryId',
                select: 'category' // Populate the bin category's name
            })
            .populate({
                path: 'collectorId',
                select: 'name' // Populate the collector's name
            });

        res.status(200).json({ bookings });
    } catch (err) {
        console.error('Error while handling database error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

exports.completeCollection = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const userId = req.userId;
        // Update booking status to completed only if the booking is assigned to the current collector
        const booking = await Booking.findOne({ _id: bookingId, collectorId: userId });
            
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found or not assigned to this collector' });
        }

        booking.status = 'Completed';
        await booking.save();

        // Update invoice status to 'Paid'
        const invoice = await Invoice.findOne({ bookingId });
        if (invoice) {
            invoice.status = 'Paid';
            await invoice.save();
        }

        res.status(200).json({ message: 'Collection completed successfully' });
    } catch (err) {
        console.error('Error while handling database error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};
