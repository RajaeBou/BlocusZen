const express = require('express');
const router = express.Router();
const verifyToken = require('../firebase-auth');

router.get('/', verifyToken, (req, res) => {
  res.json({ message: "Bienvenue " + req.user.email });
});

module.exports = router;
