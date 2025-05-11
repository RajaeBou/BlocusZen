const express = require("express");
const multer = require("multer");
const Synthese = require("../models/Synthese");
const router = express.Router();
const verifyToken = require('../firebase-auth');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage })
router.post(
  "/api/synthese/upload",
  upload.single("file"),
  async (req, res) => {
    try {
      console.log("Fichier reçu :", req.file);
      console.log("Body reçu :", req.body);

      const { title, subject, level, university, tags} = req.body;
      const filePath = req.file ? req.file.path : null;

      const newSynthese = new Synthese({
        title,
        subject,
        level,
        userId: req.user?.uid || "anonyme",
        tags,
        university,
        fichier: filePath,
      });
      

      await newSynthese.save();
      res.status(201).json({ message: "Synthèse enregistrée avec succès" });
    } catch (err) {
      console.error("❌ Erreur lors de l'enregistrement :", err);
      res.status(500).json({ error: err.message });
    }
  }
);


router.get("/api/syntheses", verifyToken, async (req, res) => {
  try {
    const syntheses = await Synthese.find().sort({ date: -1 });
    res.status(200).json(syntheses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
