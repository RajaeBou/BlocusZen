const express = require("express");
const router = express.Router();
const Invite = require("../models/Invite");
const verifyToken = require("../firebase-auth");
const UserProfile = require("../models/UserProfile");
const StudySession = require("../models/StudySession");
const createNotification = require("../utils/createNotification"); // ✅ Utilitaire centralisé
const Notification = require("../models/Notification");

// POST /api/invitations
router.post("/", verifyToken, async (req, res) => {
  try {
    const from = req.user.uid;
    const { to, sessionId } = req.body;

    if (!to) {
      return res.status(400).json({ error: "Champ 'to' manquant" });
    }

    const newInvite = new Invite({
      from,
      to,
      sessionId: sessionId || null,
    });

    const saved = await newInvite.save();

    // 🔔 Créer une notification pour l'invité
    await createNotification({
      userId: to,
      content: "📨 Tu as reçu une nouvelle invitation à une session d'étude.",
      type: "invite",
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error("Erreur POST /api/invitations :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET /api/invitations/received/:userId
router.get("/received/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const invites = await Invite.find({ to: userId }).sort({ createdAt: -1 });

    const invitesWithSenderProfiles = await Promise.all(
      invites.map(async (inv) => {
        const fromProfile = await UserProfile.findOne({ userId: inv.from });
        return {
          ...inv.toObject(),
          fromProfile: fromProfile || null,
        };
      })
    );

    res.json(invitesWithSenderProfiles);
  } catch (err) {
    console.error("Erreur récupération invitations :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PATCH /api/invitations/:id/:status
router.patch("/:id/:status", verifyToken, async (req, res) => {
  const { id, status } = req.params;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Statut invalide" });
  }

  try {
    const invite = await Invite.findById(id);
    if (!invite) return res.status(404).json({ error: "Invitation introuvable" });

    invite.status = status;
    await invite.save();

    if (status === "accepted") {
      if (!invite.sessionId) {
        return res.status(400).json({ error: "Aucune session associée à cette invitation" });
      }

      const session = await StudySession.findById(invite.sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session introuvable" });
      }

      const alreadyAdded = session.acceptedUsers
        .map((id) => id.toString())
        .includes(invite.to.toString());

      if (!alreadyAdded) {
        session.acceptedUsers.push(invite.to);
        await session.save();
      }

      // 🔔 Créer une notification pour l’organisateur
      await createNotification({
        userId: invite.from,
        content: "✅ Ton invitation a été acceptée par un participant !",
        type: "invite",
      });
    }

    res.json({ message: "Invitation mise à jour", invite });
  } catch (err) {
    console.error("Erreur PATCH invitation:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
