const mongoose = require("mongoose");

const SyntheseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  level: { type: String, required: true },
  fileUrl: { type: String },
  content: { type: String }, 
  tags: { type: String },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  fichier: { type: String },
  university: {type: String, required: true}

});

module.exports = mongoose.model("Synthese", SyntheseSchema);
