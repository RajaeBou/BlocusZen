
// routes/aiHelper.js
const express = require('express');
const router = express.Router();

// 🧠 Simulateur IA : générer un résumé simple à partir d'un sujet
router.post('/generate-summary', async (req, res) => {
  try {
    const { subject } = req.body;

    // Simulation simple (tu peux remplacer ça plus tard avec OpenAI API)
    const summaries = {
      'analyse': "L'analyse mathématique concerne l'étude des fonctions, des limites, des dérivées et des intégrales.",
      'reseaux': "Les réseaux informatiques permettent l'échange de données entre dispositifs interconnectés.",
      'poo': "La POO est un paradigme fondé sur les objets, l'encapsulation, l'héritage et le polymorphisme."
    };

    const summary = summaries[subject.toLowerCase()] || `Résumé intelligent pour le sujet "${subject}" : (à compléter...).`;

    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
