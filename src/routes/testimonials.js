const express = require("express");
const router = express.Router();
const Testimonial = require("../models/Testimonial");

// Rota para obter a mensagem de status
router.get("/", (req, res) => res.send("API de Depoimentos funcionando!"));

// Rota para criar um novo depoimento
router.post("/", async (req, res) => {
  try {
    const { nome, texto, status, badge } = req.body;

    if (!nome || !texto || !status || !badge) {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios." });
    }

    const newTestimonial = new Testimonial({ nome, texto, status, badge });
    await newTestimonial.save();

    res
      .status(201)
      .json({
        message: "Depoimento salvo com sucesso!",
        testimonial: newTestimonial,
      });
  } catch (error) {
    console.error("Erro ao salvar depoimento:", error);
    res.status(500).json({ message: "Erro ao salvar depoimento." });
  }
});

module.exports = router;
