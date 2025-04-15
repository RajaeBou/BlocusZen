// routes/synthese.js
const express = require('express');
const router = express.Router();
const Synthese = require('../models/Synthese');

// 📄 Voir toutes les synthèses partagées
router.get('/', async (req, res) => {
  try {
    const syntheses = await Synthese.find().populate('userId', 'name university field level');
    res.json(syntheses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ Partager une nouvelle synthèse
router.post('/', async (req, res) => {
  try {
    const newSynthese = new Synthese(req.body);
    await newSynthese.save();
    res.status(201).json(newSynthese);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🗑️ Supprimer une synthèse
router.delete('/:id', async (req, res) => {
  try {
    await Synthese.findByIdAndDelete(req.params.id);
    res.json({ message: 'Synthèse supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
