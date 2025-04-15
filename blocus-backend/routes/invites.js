const express = require('express');
const router = express.Router();
const Invite = require('../models/Invite');

// ➕ Envoyer une invitation
router.post('/', async (req, res) => {
  try {
    const { fromUser, toUser, sessionId } = req.body;
    const invite = new Invite({ fromUser, toUser, sessionId });
    await invite.save();
    res.status(201).json(invite);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Accepter une invitation
router.post('/:id/accept', async (req, res) => {
  try {
    const invite = await Invite.findByIdAndUpdate(req.params.id, { status: 'accepted' }, { new: true });
    res.json(invite);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ❌ Refuser une invitation
router.post('/:id/decline', async (req, res) => {
  try {
    const invite = await Invite.findByIdAndUpdate(req.params.id, { status: 'declined' }, { new: true });
    res.json(invite);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔍 Voir les invitations reçues par un utilisateur
router.get('/received/:userId', async (req, res) => {
  try {
    const invites = await Invite.find({ toUser: req.params.userId }).populate('fromUser sessionId');
    res.json(invites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
