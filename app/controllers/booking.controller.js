const Booking = require('../models/Booking');
const BinCategory = require('../models/BinCategory');
const User = require('../models/User');


// Function to calculate total payment based on bin category and quantity
const calculateTotalPayment = async (category, quantity) => {
    const Category = await BinCategory.findById(category);
    if (!Category) {
        throw new Error('Bin category not found');
    }

    let price;
    if (Category.category === 'smallSack') {
        price = 10; // Price for small sack
    } else if (Category.category === 'bigSack') {
        price = 15; // Price for big sack
    } else {
        throw new Error('Invalid bin category');
    }

    const totalPayment = price * quantity;

    if (isNaN(totalPayment)) {
        throw new Error('Failed to calculate total payment');
    }

    return totalPayment;
};

// Function to randomly select a collector ID
const assignRandomCollectorId = async () => {
    try {
        // Find all collectors
        const collectors = await User.find({ role: 'collector' });

        // Generate a random index
        const randomIndex = Math.floor(Math.random() * collectors.length);

        // Get the random collector ID
        const randomCollectorId = collectors[randomIndex]._id;

        return randomCollectorId;
    } catch (err) {
        console.error('Error while handling database error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

exports.bookSchedule = async (req, res) => {
    try {
        const { userId, binCategoryId, location, scheduleDateTime, quantity } = req.body;

        // Calculate total payment
        const totalPayment = await calculateTotalPayment(binCategoryId, quantity);

        // Assign a random collector ID
        const collectorId = await assignRandomCollectorId();

        // Find the resident/user by userId
        const user = await User.findById(userId);

        // Create a new booking with the assigned collectorId and the resident's name
        const booking = new Booking({ 
            userId, 
            userName: user.name, // Include the resident's name in the booking
            binCategoryId, 
            location, 
            scheduleDateTime, 
            quantity, 
            totalPayment, 
            collectorId 
        });

        // Save the booking
        await booking.save();

        res.status(201).json({ message: 'Booking created successfully' });
    }catch (err) {
        console.error('Error while handling database error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

exports.viewBookingDetails = async (req, res) => {
    try {
        const { userId } = req.params; // Get the userId from URL params

        // Find bookings for the user and populate fields with names
        const bookings = await Booking.find({ userId }) // Use find method with userId as filter
            .populate({
                path: 'userId',
                select: 'name' // Populate the resident's name and contact
            })
            .populate({
                path: 'binCategoryId',
                select: 'category' // Populate the bin category's name
            })
            .populate({
                path: 'collectorId',
                select: 'name contact' // Populate the collector's name
            });

        res.status(200).json({ bookings });
    } catch (err) {
        console.error('Error while handling database error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};


exports.cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.body;

        // Delete the booking
        await Booking.findByIdAndDelete(bookingId);

        res.status(200).json({ message: 'Booking canceled successfully' });
    }catch (err) {
        console.error('Error while handling database error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};


