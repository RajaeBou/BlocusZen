const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  sector: { type: String, required: true } // Exemples : Santé, Sciences humaines...
});

module.exports = mongoose.model("Field", FieldSchema);
