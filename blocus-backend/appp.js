const express = require('express');
const cors = require('cors');
const path = require('path');
const verifyToken = require('./firebase-auth');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Trop de requêtes. Réessayez plus tard.'
});

app.use(helmet());
app.use(limiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/logo', express.static(path.join(__dirname, 'logo')));

// Routes
app.use('/api/invitations', require('./routes/invites'));
app.use('/api/ai', require('./routes/aiHelper'));
app.use('/api/secure', require('./routes/testSecure'));
app.use('/api/liveSessions', require('./routes/liveSession'));
app.use('/api/sessions', require('./routes/studySessions'));
app.use('/api/user-profile', require('./routes/profile'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/', require('./routes/synthese'));
app.use('/references', require('./routes/references'));

app.get('/api/securised-example', verifyToken, (req, res) => {
  res.json({
    message: 'Bienvenue utilisateur Firebase ✅',
    uid: req.user.uid,
    email: req.user.email
  });
});

app.get('/', (req, res) => {
  res.send('Blocus Planner API est en ligne !');
});

module.exports = app;
