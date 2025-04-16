// routes/aiHelper.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

router.post("/generate-summary", async (req, res) => {
  try {
    const { subject } = req.body;

    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          parts: [
            { text: `Explique-moi simplement : ${subject}` }
          ]
        }
      ]
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    const summary = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Aucune réponse générée.";
    res.json({ summary });
  } catch (err) {
    console.error("Erreur Gemini :", err.response?.data || err.message);
    res.status(500).json({ error: "Erreur lors de la génération avec Gemini." });
  }
});

module.exports = router;
