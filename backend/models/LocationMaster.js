const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  locationName: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("LocationMaster", locationSchema);
