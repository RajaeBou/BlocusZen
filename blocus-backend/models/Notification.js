const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  content: String,
  isRead: { type: Boolean, default: false },
  type: { type: String, enum: ['invite', 'message', 'reminder'] }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
