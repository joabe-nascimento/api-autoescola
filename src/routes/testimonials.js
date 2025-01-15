const express = require("express");
const router = express.Router();
const Testimonial = require("./models/Testimonial");

// Obter todos os depoimentos
router.get("/api/testimonials", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar depoimentos." });
  }
});

// Adicionar novo depoimento
router.post("/api/testimonials", async (req, res) => {
  try {
    const { nome, texto, status, badge } = req.body;
    const newTestimonial = new Testimonial({ nome, texto, status, badge });
    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (error) {
    res.status(400).json({ message: "Erro ao adicionar depoimento." });
  }
});

module.exports = router;