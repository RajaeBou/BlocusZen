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
    console.log(`📥 Requête GET /invitations/received/${userId}`);

    const invites = await Invite.find({ to: userId }).sort({ createdAt: -1 });
    console.log(`🔍 Invitations trouvées : ${invites.length}`);

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

// PATCH /api/invitations/:id/:statu
// PATCH /api/invitations/:id/:status
router.patch("/:id/:status", verifyToken, async (req, res) => {
  const { id, status } = req.params;
  console.log(`\n📨 PATCH /invitations/${id}/${status}`);

  // Vérifie que le statut est valide
  if (!["accepted", "rejected"].includes(status)) {
    console.warn("❌ Statut invalide reçu :", status);
    return res.status(400).json({ error: "Statut invalide" });
  }

  try {
    const invite = await Invite.findById(id);
    if (!invite) {
      console.warn("❌ Invitation introuvable :", id);
      return res.status(404).json({ error: "Invitation introuvable" });
    }

    // 🛡️ Vérifie que seul le destinataire peut accepter/refuser
    if (req.user.uid !== invite.to) {
      console.warn(`⛔ UID non autorisé : ${req.user.uid} ≠ ${invite.to}`);
      return res.status(403).json({ error: "Non autorisé à répondre à cette invitation" });
    }

    console.log(`📤 FROM (organisateur) : ${invite.from}`);
    console.log(`📥 TO (invité) : ${invite.to}`);
    console.log(`🧾 sessionId lié : ${invite.sessionId}`);

    // Met à jour le statut
    invite.status = status;
    await invite.save();
    console.log(`📝 Statut mis à jour : ${status}`);

    // Si accepté : ajoute l'utilisateur dans la session
    if (status === "accepted") {
      if (!invite.sessionId) {
        console.error("🚫 Pas de sessionId associé à cette invitation !");
        return res.status(400).json({ error: "Aucune session associée" });
      }

      const session = await StudySession.findById(invite.sessionId);
      if (!session) {
        console.error("🚫 Session introuvable :", invite.sessionId);
        return res.status(404).json({ error: "Session non trouvée" });
      }

      const alreadyParticipant = session.acceptedUsers.includes(invite.to);
      console.log(`👥 Est déjà participant ? ${alreadyParticipant}`);

      if (!alreadyParticipant) {
        session.acceptedUsers.push(invite.to);
        await session.save();
        console.log(`✅ ${invite.to} ajouté à acceptedUsers de la session ${session._id}`);
      } else {
        console.log(`ℹ️ ${invite.to} était déjà dans la session`);
      }

      // 🔔 Notification à l’organisateur
      await createNotification({
        userId: invite.from,
        content: `✅ Ton invitation a été acceptée !`,
        type: "invite",
      });
    }

    res.json({ message: "Invitation mise à jour", invite });

  } catch (err) {
    console.error("❌ Erreur PATCH invitation :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
