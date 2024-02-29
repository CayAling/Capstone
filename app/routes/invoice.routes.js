// routes/invoice.routes.js
const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');


// Create a new invoice
router.post('/invoices', invoiceController.createInvoice);

// Update invoice status
router.put('/invoices/:id/status', invoiceController.updateInvoiceStatus);
// Get invoice by ID
router.get('/invoices/:invoiceId', invoiceController.getInvoiceById);
module.exports = router;
