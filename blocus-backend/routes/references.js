const express = require("express");
const router = express.Router();
const University = require("../models/University");
const Field = require("../models/Field");

router.get("/universities", async (req, res) => {
  try {
    const universities = await University.find().sort({ name: 1 });
    res.json(universities);
  } catch (err) {
    res.status(500).json({ error: "Erreur récupération universités" });
  }
});

router.get("/fields", async (req, res) => {
  try {
    const fields = await Field.find().sort({ name: 1 });
    res.json(fields);
  } catch (err) {
    res.status(500).json({ error: "Erreur récupération filières" });
  }
});

module.exports = router;
