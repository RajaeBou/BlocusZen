const express = require('express');
const router = express.Router();
const StudySession = require('../models/StudySession');
const verifyToken = require('../firebase-auth');

// ➕ Créer une nouvelle session
router.post('/', verifyToken, async (req, res) => {
  try {
    const session = new StudySession({
      ...req.body,
      userId: req.user.uid,
    });
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔍 Obtenir les sessions de l'utilisateur connecté
router.get('/my', verifyToken, async (req, res) => {
  try {
    const sessions = await StudySession.find({ userId: req.user.uid });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🌍 Voir les sessions publiques
router.get('/public', async (req, res) => {
  try {
    const sessions = await StudySession.find({ visibility: 'public' }).populate('userId', 'name university field level');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📝 Modifier une session (protégé + vérifie propriétaire)
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
router.get("/:id", async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session introuvable" });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ❌ Supprimer une session (protégé + vérifie propriétaire)
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
