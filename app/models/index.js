const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("../models/User");
db.role = require("../models/Role");
db.invoice = require("../models/Invoice");
db.booking = require("../models/Booking");

db.ROLES = [
  "resident",
  "admin",
  "collector"
];

module.exports = db;