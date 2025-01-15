const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  texto: { type: String, required: true },
  status: { type: String, required: true },
  badge: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Testimonial", testimonialSchema);
