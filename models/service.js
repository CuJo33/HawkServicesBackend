const mongoose = require("mongoose");
const Scheme = mongoose.Schema;
const { ObjectId } = require("mongodb");

const ServiceSchema = new Scheme({
  serviceId: {
    type: ObjectId,
    required: true,
  },
  specificRoomId: {
    type: ObjectId,
    required: true,
  },
  specificResourceId: {
    type: ObjectId,
    required: true,
  },
  serviceName: String,
  fullServiceName: String,
  lastUpdated: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = Service = mongoose.model("Service", ServiceSchema);
