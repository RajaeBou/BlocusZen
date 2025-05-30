const express = require('express');
const router = express.Router();
const StudySession = require('../models/StudySession');



router.get("/:id", async (req, res) => {
  const session = await StudySession.findById(req.params.id);
  if (!session) return res.status(404).json({ message: "Session introuvable" });
  res.json(session);
});



router.put('/:id/note', async (req, res) => {
  try {
    const session = await StudySession.findByIdAndUpdate(
      req.params.id,
      { note: req.body.note },
      { new: true }
    );
    res.json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.post('/:id/finish', async (req, res) => {
  try {
    const session = await StudySession.findByIdAndUpdate(
      req.params.id,
      { completed: true, status: 'finished' },
      { new: true }
    );
    res.json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id/note', async (req, res) => {
  try {
    const session = await StudySession.findByIdAndUpdate(
      req.params.id,
      { note: req.body.note },
      { new: true }
    );
    res.json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



module.exports = router;
