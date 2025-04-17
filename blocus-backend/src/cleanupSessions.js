const mongoose = require("mongoose");
const dotenv = require("dotenv");
const StudySession = require("../models/StudySession");

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const deleteOldSessions = async () => {
  try {
    const now = new Date();

    const deleted = await StudySession.deleteMany({
      $expr: {
        $lt: [
          { $dateFromString: { dateString: { $concat: ["$date", "T", "$endTime"] } } },
          now,
        ],
      },
    });

    console.log(`✅ ${deleted.deletedCount} sessions supprimées`);
  } catch (error) {
    console.error("❌ Erreur suppression automatique :", error);
  } finally {
    mongoose.connection.close();
  }
};

deleteOldSessions();
