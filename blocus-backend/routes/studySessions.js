const express = require("express");
const router = express.Router();
const Invite = require("../models/Invite");
const verifyToken = require("../firebase-auth");
const UserProfile = require("../models/UserProfile");
const StudySession = require("../models/StudySession");
const createNotification = require("../utils/createNotification");

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

router.patch("/:id/:status", verifyToken, async (req, res) => {
  const { id, status } = req.params;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Statut invalide" });
  }

  try {
    const invite = await Invite.findById(id);
    if (!invite) return res.status(404).json({ error: "Invitation introuvable" });

    const currentUser = req.user.uid;

    if (currentUser !== invite.from && currentUser !== invite.to) {
      return res.status(403).json({ error: "Non autorisé à modifier cette invitation" });
    }

    invite.status = status;
    await invite.save();

    if (status === "accepted") {
      const session = await StudySession.findById(invite.sessionId);
      if (!session) return res.status(404).json({ error: "Session non trouvée" });

      // Ajouter le participant s’il n’y est pas déjà
      if (!session.acceptedUsers.includes(invite.to)) {
        session.acceptedUsers.push(invite.to);
        await session.save();
      }

      // 🔔 Notifier immédiatement le participant avec le lien vers la session
      await createNotification({
        userId: invite.to,
        content: `🎉 Ton invitation à la session "${session.subject}" a été acceptée !`,
        type: "reminder",
        link: `/session/${session._id}/live`,
      });

      // ⏰ Notification 2 minutes avant le début de la session
      const sessionStart = new Date(`${session.date}T${session.startTime}`);
      const now = new Date();
      const delay = sessionStart - now - 2 * 60 * 1000;

      if (delay > 0) {
        console.log(`⏳ Notification "2 min avant" planifiée dans ${Math.round(delay / 1000)} secondes`);
        setTimeout(async () => {
          await createNotification({
            userId: invite.to,
            content: `⏰ Ta session "${session.subject}" commence dans 2 minutes.`,
            type: "reminder",
            link: `/session/${session._id}/live`,
          });
        }, delay);
      } else {
        console.log("⚠️ Trop tard pour programmer la notification 2 minutes avant.");
      }
    }

    res.json({ message: "Invitation mise à jour", invite });

  } catch (err) {
    console.error("Erreur PATCH invitation :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
