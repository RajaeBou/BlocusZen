const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  sector: { type: String, required: true } 
});

module.exports = mongoose.model("Field", FieldSchema);
