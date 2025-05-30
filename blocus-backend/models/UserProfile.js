// 📁 backend/models/UserProfile.js
const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  university: { type: String, required: true },
  field: { type: String, required: true },
  level: { type: String, required: true },
  bio: { type: String },
  photoURL: { type: String, default: "" } 
});

module.exports = mongoose.model("UserProfile", userProfileSchema);
