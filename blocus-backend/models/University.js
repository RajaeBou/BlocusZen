const mongoose = require("mongoose");

const UniversitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ["Université", "Haute École"], required: true }
});

module.exports = mongoose.model("University", UniversitySchema);
