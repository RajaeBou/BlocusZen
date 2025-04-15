const mongoose = require("mongoose");

const StudySessionSchema = new mongoose.Schema({
  userId: {
    type: String, // ✅ Corrigé
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
    type: String, // Prise de note pendant la session
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
    default: "pending", // active = en cours, finished = terminée
  },
}, { timestamps: true });

module.exports = mongoose.model("StudySession", StudySessionSchema);
