const mongoose = require("mongoose");
const Scheme = mongoose.Schema;
const { ObjectId } = require("mongodb");

const QuoteSchema = new Scheme({
  quoteId: {
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
  jobList: Array,
  clientAccepted: Boolean,
  RequestDate: String,
  lastUpdated: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = Quote = mongoose.model("Quote", QuoteSchema);
