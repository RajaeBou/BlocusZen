const Notification = require('../models/Notification');

const createNotification = async ({ userId, content, type }) => {
  try {
    return await Notification.create({
      userId,
      content: typeof content === 'string' ? content : JSON.stringify(content),
      type,
      isRead: false,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("Erreur création notification :", err);
  }
};

module.exports = createNotification;
