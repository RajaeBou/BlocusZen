// routes/userProfile.js
const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');

// 🔍 Obtenir les infos de profil d’un utilisateur
router.get('/:userId', async (req, res) => {
  try {
    const profile = await UserProfile.findById(req.params.userId);
    if (!profile) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Modifier le profil utilisateur
router.put('/:userId', async (req, res) => {
  try {
    const updatedProfile = await UserProfile.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    );
    res.json(updatedProfile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
