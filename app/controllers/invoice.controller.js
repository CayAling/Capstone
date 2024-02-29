
const Invoice = require('../models/Invoice');
const Booking = require('../models/Booking');


exports.createInvoice = async (req, res) => {
    try {
        const { bookingId } = req.body;

        // Find the booking to get the totalPayment
        const booking = await Booking.findById(bookingId)
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

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const { totalPayment } = booking;

        // Create a new invoice
        const invoice = new Invoice({ bookingId, amount: totalPayment, status: 'Pending' });
        await invoice.save();

        res.status(201).json({ message: 'Invoice created successfully', invoice });
    } catch (err) {
        console.error('Error while handling database error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

exports.updateInvoiceStatus = async (req, res) => {
    try {
        const { id } = req.params; // Get the invoice ID from the URL params
        const { status } = req.body; // Get the new status from the request body

        // Update invoice status
        const updatedInvoice = await Invoice.findByIdAndUpdate(id, { status }, { new: true} );


        if (!updatedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json({ message: 'Invoice status updated successfully', updatedInvoice });
    } catch (err) {
        console.error('Error while handling database error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};


exports.getInvoiceById = async (req, res) => {
    try {
        const { invoiceId } = req.params;

        // Find the invoice by ID
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json({ invoice });
    } catch (err) {
        console.error('Error while handling database error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};
