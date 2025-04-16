// models/Synthese.js
const mongoose = require('mongoose');

const syntheseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject: String,
  description: String,
  fileUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Synthese', syntheseSchema);
