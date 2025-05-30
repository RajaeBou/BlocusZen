const express = require("express");
const router = express.Router();
const verifyToken = require("../firebase-auth");
const UserProfile = require("../models/UserProfile");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, req.params.userId + ext);
  },
});
const upload = multer({ storage });

router.get("/api/profile/:userId", verifyToken, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.params.userId });
    if (!profile) return res.status(200).json(null);
    res.json(profile);
  } catch (err) {
    console.error("❌ Erreur GET /api/profile/:userId :", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/api/profile/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, university, field, level, bio } = req.body;

    if (!name || !university || !field || !level) {
      return res.status(400).json({ error: "Champs requis manquants." });
    }

    const updated = await UserProfile.findOneAndUpdate(
      { userId },
      { name, university, field, level, bio },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("❌ Erreur PUT /api/profile/:userId :", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/api/profile/:userId/photo", verifyToken, upload.single("photo"), async (req, res) => {
  try {
    const userId = req.params.userId;
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Aucune image fournie" });

    const ext = path.extname(file.originalname);
    const relativePath = `/uploads/${userId}${ext}`;

    const updated = await UserProfile.findOneAndUpdate(
      { userId },
      { photoURL: relativePath },
      { new: true }
    );

    res.json({ success: true, photoURL: relativePath });
  } catch (err) {
    console.error("❌ Erreur upload photo :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
