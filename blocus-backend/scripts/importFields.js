require("dotenv").config({ path: "./.env" });

const mongoose = require("mongoose");
const Field = require("../models/Field");

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connexion à MongoDB réussie !");
  insertFields();
}).catch(err => {
  console.error("❌ Erreur MongoDB :", err);
});

const fields = [
  // Sciences humaines
  { name: "Philosophie", sector: "Sciences humaines" },
  { name: "Théologie", sector: "Sciences humaines" },
  { name: "Langues, lettres et traductologie", sector: "Sciences humaines" },
  { name: "Histoire, histoire de l'art et archéologie", sector: "Sciences humaines" },
  { name: "Information et communication", sector: "Sciences humaines" },
  { name: "Sciences politiques et sociales", sector: "Sciences humaines" },
  { name: "Sciences juridiques", sector: "Sciences humaines" },
  { name: "Criminologie", sector: "Sciences humaines" },
  { name: "Sciences économiques et de gestion", sector: "Sciences humaines" },
  { name: "Sciences psychologiques et de l'éducation", sector: "Sciences humaines" },

  // Santé
  { name: "Sciences médicales", sector: "Santé" },
  { name: "Sciences vétérinaires", sector: "Santé" },
  { name: "Sciences dentaires", sector: "Santé" },
  { name: "Sciences biomédicales et pharmaceutiques", sector: "Santé" },
  { name: "Sciences de la santé publique", sector: "Santé" },
  { name: "Sciences de la motricité", sector: "Santé" },

  // Sciences et Techniques
  { name: "Sciences", sector: "Sciences et Techniques" },
  { name: "Sciences agronomiques et ingénierie biologique", sector: "Sciences et Techniques" },
  { name: "Sciences de l'ingénieur et technologie", sector: "Sciences et Techniques" },
  { name: "Art de bâtir et urbanisme", sector: "Sciences et Techniques" },

  // Art
  { name: "Arts plastiques, visuels et de l'espace", sector: "Art" },
  { name: "Musique", sector: "Art" },
  { name: "Théâtre et arts de la parole", sector: "Art" },
];

async function insertFields() {
  try {
    await Field.deleteMany({}); // 🔄 Nettoyage avant insertion
    await Field.insertMany(fields);
    console.log("✅ Filières insérées avec succès !");
  } catch (err) {
    console.error("❌ Erreur d’insertion :", err);
  } finally {
    mongoose.disconnect();
  }
}
