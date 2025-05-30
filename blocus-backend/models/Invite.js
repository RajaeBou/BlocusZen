
const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema({
  from: { type: String, required: true }, 
  to: { type: String, required: true },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "StudySession", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Invite", inviteSchema);
