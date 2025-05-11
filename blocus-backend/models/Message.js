const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from: { type: String, required: true }, // UID Firebase
  to: { type: String, required: true },   // UID Firebase
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false }, // ✅ Ajouté ici
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
