const express = require("express");
const cors = require("cors");
const path = require('path');
const connectDB = require("./config/db");
const verifyToken = require("./firebase-auth");
require("dotenv").config();

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));


connectDB();


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const inviteRoutes = require('./routes/invites');
const notificationRoutes = require('./routes/notifications');
const aiHelperRoutes = require('./routes/aiHelper');
const testSecureRoutes = require('./routes/testSecure');
const liveSessionRoutes = require('./routes/liveSession');
const studySessionRoutes = require('./routes/studySessions');
const userProfileRoutes = require('./routes/profile');
const syntheseRoutes = require('./routes/synthese');
const profileRoutes = require('./routes/profile');
const messageRoutes = require("./routes/messages");
const referencesRoutes = require('./routes/references');


app.use('/api/invitations', require('./routes/invites'));

app.use('/api/ai', aiHelperRoutes);
app.use('/api/secure', testSecureRoutes);
app.use("/api/liveSessions", liveSessionRoutes);
app.use("/api/sessions", studySessionRoutes);
app.use('/api/user-profile', userProfileRoutes);
app.use('/', syntheseRoutes);
app.use("/uploads", express.static("uploads"));
app.use(profileRoutes);
app.use("/api/messages", messageRoutes);
app.use('/api/notifications', notificationRoutes); // ✅ Cette ligne est essentielle
app.use('/references', referencesRoutes); // 👈 monte le routeur
app.use("/logo", express.static(path.join(__dirname, "logo"))); // servir l'avatar par défaut


app.get("/", (req, res) => {
  res.send("Blocus Planner API est en ligne !");
});

app.get("/api/securised-example", verifyToken, (req, res) => {
  res.json({
    message: "Bienvenue utilisateur Firebase ✅",
    uid: req.user.uid,
    email: req.user.email,
  });
});

const PORT = process.env.PORT || 5000; 
const MONGO_PORT = process.env.MONGO_PORT || "27017";
const DB_NAME = process.env.MONGODB_URI?.split("/").pop() || "non défini";

app.listen(PORT, () => {
  console.log("✅ MongoDB connecté !");
  console.log(`🌐 Backend : http://localhost:${PORT}`);
  console.log(`🛢️ MongoDB : mongodb://localhost:${MONGO_PORT}`);
  console.log(`📦 Base utilisée : ${DB_NAME}`);

  if (app._router && app._router.stack) {
    console.log("\n✅ Liste des routes chargées :");
    app._router.stack
      .filter(r => r.route && r.route.path)
      .forEach(r => console.log("➡️", r.route.path));
  }
});
