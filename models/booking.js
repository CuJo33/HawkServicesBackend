const mongoose = require("mongoose");
const Scheme = mongoose.Schema;
const { ObjectId } = require("mongodb");

const BookingSchema = new Scheme({
  bookingId: {
    type: ObjectId,
    required: true,
  },
  clientId: {
    type: ObjectId,
    required: true,
  },
  employeeId: {
    type: ObjectId,
    required: true,
  },
  requestDate: String,
  bookedDate: String,
  completed: Boolean,
  lastUpdated: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = Booking = mongoose.model("Booking", BookingSchema);
