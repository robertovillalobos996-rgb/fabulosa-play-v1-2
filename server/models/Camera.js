const mongoose = require("mongoose");

const CameraSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    default: "youtube",
  },

  source: {
    type: String,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  order: {
    type: Number,
    default: 0,
  },

  category: {
    type: String,
    default: "general",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Camera", CameraSchema);