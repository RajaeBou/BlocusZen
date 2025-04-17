require("dotenv").config({ path: "../.env" });

const mongoose = require("mongoose");
const University = require("../models/University");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Connexion à MongoDB réussie !");
  insertUniversities();
}).catch(err => {
  console.error("❌ Erreur MongoDB :", err);
});

const universities = [
  { name: "Université catholique de Louvain (UCLouvain)", type: "Université" },
  { name: "Université libre de Bruxelles (ULB)", type: "Université" },
  { name: "Université de Liège (ULiège)", type: "Université" },
  { name: "Université de Mons (UMons)", type: "Université" },
  { name: "Université de Namur (UNamur)", type: "Université" },

  { name: "Haute École de la Province de Liège (HEPL)", type: "Haute École" },
  { name: "Haute École Louvain en Hainaut (HELHa)", type: "Haute École" },
  { name: "Haute École provinciale de Hainaut - Condorcet", type: "Haute École" },
  { name: "Haute École Léonard de Vinci", type: "Haute École" },
  { name: "Haute École libre mosane (HELMo)", type: "Haute École" },
  { name: "Haute École de Namur-Liège-Luxembourg (Hénallux)", type: "Haute École" },
  { name: "Haute École Galilée (HEG)", type: "Haute École" },
  { name: "Haute École EPHEC (EPHEC)", type: "Haute École" },
  { name: "Haute École en Hainaut (HEH)", type: "Haute École" },
  { name: "Haute École Charlemagne (heCh)", type: "Haute École" },
  { name: "Haute École «Groupe ICHEC - ISC Saint-Louis - ISFSC»", type: "Haute École" },
  { name: "Haute École Francisco Ferrer", type: "Haute École" },
  { name: "Haute École Bruxelles-Brabant (HE2B)", type: "Haute École" },
  { name: "Haute École Albert Jacquard (HEAJ)", type: "Haute École" },
  { name: "Haute École libre de Bruxelles - Ilya Prigogine (HELB)", type: "Haute École" },
  { name: "Haute École Robert Schuman", type: "Haute École" },
  { name: "Haute École de la Ville de Liège (HEL)", type: "Haute École" },
  { name: "Haute École Lucia de Brouckère (HELdB)", type: "Haute École" },
  { name: "Haute École de la Province de Namur (HEPN)", type: "Haute École" }
];

async function insertUniversities() {
  try {
    await University.deleteMany({}); // 🔄 Vide la collection avant insertion
    await University.insertMany(universities);
    console.log("✅ Universités insérées avec succès !");
  } catch (err) {
    console.error("❌ Erreur d’insertion :", err);
  } finally {
    mongoose.disconnect();
  }
}
