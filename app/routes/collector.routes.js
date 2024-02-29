// routes/collector.routes.js
const express = require('express');
const router = express.Router();
const collectorController = require('../controllers/collector.controller');
const { verifyToken } = require('../middlewares/auth');

router.get('/assigned-schedules', verifyToken, collectorController.viewAssignedSchedules); // View Schedule by collector
router.put('/complete-collection', verifyToken, collectorController.completeCollection); // Set status of collection

module.exports = router;
