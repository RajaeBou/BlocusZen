
const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  university: String,
  field: String,
  level: String,
  notificationsEnabled: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', userProfileSchema);



///
///const mongoose = require("mongoose");

///const UserProfileSchema = new mongoose.Schema({
  ///uid: { type: String, required: true, unique: true },
  ///name: { type: String, required: true },
  ///university: { type: mongoose.Schema.Types.ObjectId, ref: "University" }, // 🔁 relation
  ///field: { type: mongoose.Schema.Types.ObjectId, ref: "Field" },           // 🔁 relation
  ///level: { type: String, enum: ["Bachelier", "Master", "Doctorat"] }
///});

///module.exports = mongoose.model("UserProfile", UserProfileSchema);
