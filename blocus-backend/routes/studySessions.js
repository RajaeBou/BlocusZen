const express = require('express');
const router = express.Router();
const StudySession = require('../models/StudySession');
const verifyToken = require('../firebase-auth');
const UserProfile = require('../models/UserProfile');
const createNotification = require('../utils/createNotification'); // ✅ Ajout utilitaire

// ✅ Créer une session
router.post('/', verifyToken, async (req, res) => {
  try {
    const { subject, date, startTime, endTime, visibility, note } = req.body;

    const session = new StudySession({
      subject,
      date,
      startTime,
      endTime,
      visibility: visibility || 'private',
      note,
      userId: req.user.uid,
    });

    await session.save();

    // 🔔 Créer une notification si session publique (utile pour rappel futur, ou pour afficher dans l’historique)
    if (session.visibility === 'public') {
      await createNotification({
        userId: req.user.uid,
        content: `🆕 Tu as créé une session publique sur "${subject}".`,
        type: 'reminder',
      });
    }

    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Voir ses propres sessions
router.get("/my", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;

    const sessions = await StudySession.find({
      $or: [
        { userId: uid },
        { acceptedUsers: uid }
      ]
    });

    const withRoles = sessions.map((session) => {
      const role = session.userId === uid ? "Organisateur" : "Participant";
      console.log(`[DEBUG] Session ${session._id} → userId: ${session.userId} | accepted: ${session.acceptedUsers} | UID: ${uid} | Rôle: ${role}`);

      return { ...session.toObject(), role };
    });

    res.json(withRoles);
  } catch (err) {
    console.error("Erreur /sessions/my :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ✅ Voir les sessions publiques (exclut les siennes)
router.get('/public', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    const sessions = await StudySession.find({ 
      visibility: 'public',
      userId: { $ne: userId }
    });

    const sessionsWithProfiles = await Promise.all(
      sessions.map(async (session) => {
        const organizerProfile = await UserProfile.findOne({ userId: session.userId });

        const participantsProfiles = await Promise.all(
          (session.acceptedUsers || []).map(async (id) => {
            return await UserProfile.findOne({ userId: id });
          })
        );

        const isParticipant = session.acceptedUsers?.includes(userId);

        return {
          ...session.toObject(),
          organizerProfile,
          participantsProfiles,
          isParticipant,
        };
      })
    );

    res.json(sessionsWithProfiles);
  } catch (error) {
    console.error("Erreur lors de la récupération des sessions publiques:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Modifier une session (protégé + propriétaire)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.id);

    if (!session) return res.status(404).json({ error: 'Session non trouvée' });
    if (session.userId.toString() !== req.user.uid)
      return res.status(403).json({ error: 'Non autorisé à modifier cette session' });

    const updated = await StudySession.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Récupérer une session par ID
router.get("/:id", async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session introuvable" });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Supprimer une session (protégé + propriétaire)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.id);

    if (!session) return res.status(404).json({ error: 'Session non trouvée' });
    if (session.userId.toString() !== req.user.uid)
      return res.status(403).json({ error: 'Non autorisé à supprimer cette session' });

    await session.deleteOne();
    res.json({ message: 'Session supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
