const mongoose = require("mongoose");
const Scheme = mongoose.Schema;
const { ObjectId } = require("mongodb");

const JobSchema = new Scheme({
  jobId: {
    type: ObjectId,
    required: true,
  },
  clientId: {
    type: ObjectId,
    required: true,
  },
  quoteId: {
    type: ObjectId,
    required: true,
  },
  roomId: {
    type: ObjectId,
    required: true,
  },
  serviceId: {
    type: ObjectId,
    required: true,
  },
  jobStatusId: {
    type: ObjectId,
    required: true,
  },
  employeeId: {
    type: ObjectId,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  estimatedCompletionDate: {
    type: Date,
    default: Date.now,
  },
  completedDate: {
    type: Date,
    default: Date.now,
  },
  clientSignOff: Boolean,
  clientSignOffDate: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = Job = mongoose.model("Job", JobSchema);
