const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const UserProfile = require("../models/UserProfile");
const verifyToken = require("../firebase-auth");
const createNotification = require("../utils/createNotification");

router.post("/", verifyToken, async (req, res) => {
  try {
    const { to, content } = req.body;
    const from = req.user.uid;

    if (!to || !content) {
      return res.status(400).json({ error: "Champs 'to' et 'content' requis." });
    }

    const newMessage = await Message.create({
      from,
      to,
      content,
      createdAt: new Date(),
    });

    const senderProfile = await UserProfile.findOne({ userId: from });
    const senderName = senderProfile?.name || "quelqu’un";

    await createNotification({
      userId: to,
      content: `📩 Nouveau message de ${senderName}`,
      type: "message",
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Erreur lors de l'envoi d'un message :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


router.get("/conversations", verifyToken, async (req, res) => {
    try {
      const currentUserId = req.user.uid;
  
      const messages = await Message.find({
        $or: [{ from: currentUserId }, { to: currentUserId }],
      }).sort({ createdAt: -1 });
  
      const conversationsMap = new Map();
  
      for (const msg of messages) {
        const otherUserId = msg.from === currentUserId ? msg.to : msg.from;
  
        if (!conversationsMap.has(otherUserId)) {
          const otherProfile = await UserProfile.findOne({ userId: otherUserId });
  
          conversationsMap.set(otherUserId, {
            userId: otherUserId,
            name: otherProfile?.name || "Utilisateur inconnu",
            lastMessage: msg.content,
            isUnread: msg.to === currentUserId && !msg.isRead,
          });
        }
      }
  
      res.json(Array.from(conversationsMap.values()));
    } catch (error) {
      console.error("Erreur conversations :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

router.get("/conversation/:otherUserId", verifyToken, async (req, res) => {
    try {
      const currentUserId = req.user.uid;
      const { otherUserId } = req.params;
  
      await Message.updateMany(
        { from: otherUserId, to: currentUserId, isRead: false },
        { $set: { isRead: true } }
      );
  
      const messages = await Message.find({
        $or: [
          { from: currentUserId, to: otherUserId },
          { from: otherUserId, to: currentUserId },
        ],
      }).sort({ createdAt: 1 });
  
      res.json(messages);
    } catch (error) {
      console.error("Erreur récupération messages :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

router.patch("/:id/read", verifyToken, async (req, res) => {
    try {
      const msg = await Message.findByIdAndUpdate(
        req.params.id,
        { isRead: true },
        { new: true }
      );
      if (!msg) return res.status(404).json({ error: "Message introuvable" });
      res.json(msg);
    } catch (err) {
      console.error("Erreur PATCH message lu :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });
  
  
  
module.exports = router;
