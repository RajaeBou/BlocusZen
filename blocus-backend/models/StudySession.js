const mongoose = require("mongoose");

const StudySessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  note: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  visibility: {
    type: String,
    enum: ["private", "public"],
    default: "private",
  },
  status: {
    type: String,
    enum: ["pending", "active", "finished"],
    default: "pending",
  },
  acceptedUsers: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model("StudySession", StudySessionSchema);
