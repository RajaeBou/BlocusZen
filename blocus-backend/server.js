const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const verifyToken = require("./firebase-auth");
require("dotenv").config();
//const userProfileRoutes = require("./routes/userProfile"); 
const referenceRoutes = require("./routes/references");

//const studySessionRoutes = require('./routes/studySessions');
//app.use('/api/study-sessions', studySessionRoutes);
const app = express();

const inviteRoutes = require('./routes/invites');
app.use('/api/invites', inviteRoutes);

const notificationRoutes = require('./routes/notifications');
app.use('/api/notifications', notificationRoutes);

const userProfileRoutes = require('./routes/userProfile');
app.use('/api/user-profile', userProfileRoutes);

const syntheseRoutes = require('./routes/synthese');
app.use('/api/synthese', syntheseRoutes);

const liveSessionRoutes = require('./routes/liveSession');
app.use('/api/live-session', liveSessionRoutes);

const aiHelperRoutes = require('./routes/aiHelper');
app.use('/api/ai', aiHelperRoutes);

app.use('/api/secure', require('./routes/testSecure'));


app.use(cors());
app.use(express.json());

// 🔌 Connexion à MongoDB
connectDB();

//app.use("/api", referenceRoutes);
//app.use("/api", userProfileRoutes);

// 🔁 Importation des routes pour les sessions
const studySessionRoutes = require("./routes/studySessions");
app.use("/api/sessions", studySessionRoutes);

// ✅ Route test publique
app.get("/", (req, res) => {
  res.send("Blocus Planner API est en ligne !");
});

app.get("/api/securised-example", verifyToken, (req, res) => {
  res.json({
    message: "Bienvenue utilisateur Firebase ✅",
    uid: req.user.uid,  // Affichage de l'UID de l'utilisateur
    email: req.user.email,  // Affichage de l'email de l'utilisateur
  });
});


// 🔧 Ports depuis le fichier .env
const PORT = process.env.PORT || 5000;
const MONGO_PORT = process.env.MONGO_PORT || "27017";
const DB_NAME = process.env.MONGODB_URI?.split("/").pop() || "non défini";

// 🚀 Lancement du serveur
app.listen(PORT, () => {
  console.log("✅ MongoDB connecté !");
  console.log(`🌐 Backend : http://localhost:${PORT}`);
  console.log(`🛢️ MongoDB : mongodb://localhost:${MONGO_PORT}`);
  console.log(`📦 Base utilisée : ${DB_NAME}`);
});
