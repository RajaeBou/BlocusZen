const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const verifyToken = require("../firebase-auth");

router.get("/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;
  const { type, limit = 20, skip = 0 } = req.query;

  try {
    const filter = { userId };
    if (type) filter.type = type;

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.patch("/:id/read", verifyToken, async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notif) return res.status(404).json({ message: "Notification introuvable" });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
});

module.exports = router;
